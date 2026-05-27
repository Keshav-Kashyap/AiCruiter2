"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Vapi from '@vapi-ai/web';
import axios from 'axios';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { supabase } from '@/services/supaBaseClient';

import StartInterviewHeader from './_components/StartInterviewHeader';
import InterviewParticipantCard from './_components/InterviewParticipantCard';
import InterviewControls from './_components/InterviewControls';
import CodeEditorPanel from './_components/CodeEditorPanel';
import {
    buildQuestionList,
    formatLanguageLabel,
    formatTimer,
    getDeepgramLangCode,
    getFirstMessage,
    getOpenAIVoice,
    getSystemPrompt,
    safeStringify,
} from './_components/interviewSessionHelpers';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const vapiRef = useRef(null);
    const callEndReasonRef = useRef(null);
    const callFailedRef = useRef(false);
    const [activeUser, setActiveUser] = useState(false);
    const [conversation, setConversation] = useState([]);
    const { interview_id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [callStarting, setCallStarting] = useState(false);
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [editorWidth, setEditorWidth] = useState(45);
    const [showTips, setShowTips] = useState(true);
    const silenceTimerRef = useRef(null);
    const lastUserActivityRef = useRef(Date.now());
    const silencePromptsRef = useRef(0);
    const feedbackRequestedRef = useRef(false);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isCallActive) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    const languageRaw = interviewInfo?.interviewData?.language || '';
    const languageDisplay = formatLanguageLabel(languageRaw);
    const durationDisplay = interviewInfo?.interviewData?.duration || '30 min';

    useEffect(() => {
        if (interviewInfo) return;

        const storedSession = sessionStorage.getItem('interviewSession');
        if (!storedSession) return;

        try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession?.interviewData) {
                setInterviewInfo(parsedSession);
            }
        } catch (error) {
            console.error('Failed to restore interview session:', error);
        }
    }, [interviewInfo, setInterviewInfo]);

    // Initialize Vapi and setup event listeners
    useEffect(() => {
        const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY_HINDI;
        if (!vapiKey) {
            console.error('VAPI key not found in environment variables');
            return;
        }

        if (!vapiRef.current) {
            vapiRef.current = new Vapi(vapiKey);
        }

        const vapi = vapiRef.current;

        const handleMessage = (message) => {
            console.log('Message', message);

            if (message?.type === 'status-update' && message?.status === 'ended' && message?.endedReason) {
                callEndReasonRef.current = message.endedReason;
            }

            if (message?.conversation) {
                try {
                    const safeMessage = JSON.parse(safeStringify(message));
                    setConversation(prev => [...prev, safeMessage]);
                    // mark last user activity when message contains user content
                    try {
                        const conv = safeMessage?.conversation || safeMessage;
                        if (Array.isArray(conv)) {
                            const hasUser = conv.some(c => c?.role === 'user' || c?.source === 'user' || c?.speaker === 'user');
                            if (hasUser) lastUserActivityRef.current = Date.now();
                        } else if (safeMessage?.role === 'user') {
                            lastUserActivityRef.current = Date.now();
                        }
                    } catch (e) {
                        // ignore
                    }
                } catch {
                    setConversation(prev => [...prev, {
                        type: message?.type || 'unknown',
                        timestamp: new Date().toISOString(),
                        note: 'Message serialization failed'
                    }]);
                }
            }
        }

        const handleCallStart = () => {
            console.log('Call started');
            callEndReasonRef.current = null;
            callFailedRef.current = false;
            setIsCallActive(true);
            setCallStarting(false);
            setTimer(0);
            toast.success('Interview Started Successfully!');
        };

        const handleCallEnd = () => {
            console.log('Call ended');
            const endReason = callEndReasonRef.current;

            setIsCallActive(false);
            setCallStarting(false);
            setActiveUser(false);

            // Clear any silence watcher timers
            clearSilenceWatcher();

            if (callFailedRef.current) {
                toast.error('Interview disconnected. Please restart and try again.');
                console.error('Call ended after a previous failure:', endReason);
				void generateFeedback();
                return;
            }

            const failedCall = endReason && /meeting has ended|room was deleted|no-room|eject|error/i.test(String(endReason));

            if (failedCall) {
                callFailedRef.current = true;
                toast.error('Interview disconnected. Please restart and try again.');
                console.error('Call ended due to failure reason:', endReason);
                void generateFeedback();
                return;
            }

            toast.success('Interview Completed');
            void generateFeedback();
        };

        const handleSpeechStart = () => {
            console.log('AI started speaking');
            setActiveUser(false);
        };

        const handleSpeechEnd = () => {
            console.log('AI finished speaking');
            setActiveUser(true);
            // Start silence watcher after assistant finishes speaking
            startSilenceWatcher();
        };

        const handleError = (error) => {
            console.error('VAPI Error:', error);
            callFailedRef.current = true;
            callEndReasonRef.current = error?.error?.msg || error?.errorMsg || error?.message || 'unknown-error';
            setCallStarting(false);
            setIsCallActive(false);
            setLoading(false);
            toast.error('Failed to start interview. Please try again.');
            void generateFeedback();
        };

        // Register event handlers
        vapi.on('message', handleMessage);
        vapi.on('call-start', handleCallStart);
        vapi.on('call-end', handleCallEnd);
        vapi.on('speech-start', handleSpeechStart);
        vapi.on('speech-end', handleSpeechEnd);
        vapi.on('error', handleError);

        return () => {
            // Cleanup event listeners
            if (vapi) {
                vapi.off('message', handleMessage);
                vapi.off('call-start', handleCallStart);
                vapi.off('call-end', handleCallEnd);
                vapi.off('speech-start', handleSpeechStart);
                vapi.off('speech-end', handleSpeechEnd);
                vapi.off('error', handleError);
            }
            clearSilenceWatcher();
        }
    }, []);

    // Silence detection: if candidate doesn't speak after AI prompt, ask twice then end interview
    const startSilenceWatcher = (timeoutSeconds = 15) => {
        clearSilenceWatcher();
        silenceTimerRef.current = setTimeout(async () => {
            const elapsed = Date.now() - lastUserActivityRef.current;
            if (elapsed >= timeoutSeconds * 1000) {
                // no activity, prompt user
                silencePromptsRef.current += 1;
                promptUserForSpeech(silencePromptsRef.current);
                if (silencePromptsRef.current >= 2) {
                    // end interview after second unsuccessful prompt
                    toast.error('No response detected. Ending interview.');
                    stopInterview();
                } else {
                    // Give another interval
                    startSilenceWatcher(timeoutSeconds);
                }
            }
        }, timeoutSeconds * 1000);
    };

    const clearSilenceWatcher = () => {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
        silencePromptsRef.current = 0;
    };

    const promptUserForSpeech = (count) => {
        try {
            const lang = (interviewInfo?.interviewData?.language || 'english').toLowerCase();
            let promptText = '';
            if (lang === 'hindi' || lang === 'hinglish') {
                promptText = count === 1 ? 'Aap kuch boliye, main aapki response sun raha hoon.' : 'Agar aap bolna bandh kar dete hain toh interview end kar diya jayega. Kripya jawab dein.';
            } else {
                promptText = count === 1 ? 'Please say something, I am listening.' : 'If you remain silent the interview will be ended. Please respond.';
            }

            // Use browser TTS to prompt the user (safer fallback)
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                const utter = new SpeechSynthesisUtterance(promptText);
                utter.lang = lang === 'hindi' ? 'hi-IN' : 'en-US';
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utter);
            }
        } catch (e) {
            console.error('Prompt TTS failed:', e);
        }
    };

    const formatQuestions = () => buildQuestionList(interviewInfo?.interviewData);

    const startCall = async () => {
        // Validation checks
        if (!interviewInfo) {
            toast.error('Interview information not loaded');
            return;
        }

        const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY_HINDI;
        if (!vapiKey) {
            toast.error('VAPI key not found. Please check your environment variables.');
            return;
        }

        if (!vapiRef.current) {
            vapiRef.current = new Vapi(vapiKey);
        }

        // Check if already starting or active
        if (callStarting || isCallActive) {
            return;
        }

        callEndReasonRef.current = null;
        callFailedRef.current = false;
        feedbackRequestedRef.current = false;
        setConversation([]);
        setCallStarting(true);
        toast.info('Starting interview...');

        try {
            // Check microphone permission first
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (micError) {
                console.error('Microphone permission denied:', micError);
                toast.error('Microphone permission is required. Please allow access and try again.');
                setCallStarting(false);
                return;
            }

            console.log('=== VAPI Call Debug Info ===');
            console.log('VAPI Key exists:', !!vapiKey);
            console.log('Interview Info:', {
                userName: interviewInfo?.userName,
                jobPosition: interviewInfo?.interviewData?.jobPosition,
                language: interviewInfo?.interviewData?.language
            });

            const language = interviewInfo?.interviewData?.language || "english";
            const userName = interviewInfo?.userName || "Candidate";
            const jobPosition = interviewInfo?.interviewData?.jobPosition || "this position";
            const questionList = formatQuestions();

            const voiceConfig = {
                provider: "openai",
                model: "gpt-4o-mini-tts",
                voiceId: getOpenAIVoice(language),
                cachingEnabled: true
            };

            const assistantOptions = {
                model: {
                    provider: "openai",
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: getSystemPrompt(language, interviewInfo, questionList)
                        }
                    ]
                },
                voice: voiceConfig,
                transcriber: {
                    provider: "deepgram",
                    model: "nova-2",
                    language: getDeepgramLangCode(language)
                },
                firstMessage: getFirstMessage(language, userName, jobPosition)
            };

            const result = await vapiRef.current.start(
                assistantOptions,
                undefined,
                undefined,
                undefined,
                undefined,
                { roomDeleteOnUserLeaveEnabled: false }
            );
            console.log('Call started successfully:', result);

        } catch (error) {
            console.error('Detailed error starting call:', error);

            // Log the full error details
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error headers:', error.response.headers);
            } else {
                console.error('No response object:', error.message);
            }

            setCallStarting(false);
            setIsCallActive(false);

            // More specific error messages based on response
            if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || 'Invalid configuration';
                toast.error(`Configuration error: ${errorMessage}`);
                console.error('400 Error details:', error.response.data);
            } else if (error.response?.status === 401) {
                toast.error('Authentication error: Invalid VAPI key');
            } else if (error.response?.status === 403) {
                toast.error('Access denied: Check your VAPI permissions');
            } else if (error.response?.status === 429) {
                toast.error('Rate limit exceeded: Please try again later');
            } else if (!error.response) {
                toast.error('Network error: Please check your internet connection');
            } else {
                toast.error('Failed to start interview. Please check console for details.');
            }
        }
    };

    const toggleMute = () => {
        if (!isCallActive || !vapiRef.current) return;

        try {
            if (isMuted) {
                vapiRef.current.setMuted(false);
            } else {
                vapiRef.current.setMuted(true);
            }
            setIsMuted(!isMuted);
            toast.info(isMuted ? 'Microphone Unmuted' : 'Microphone Muted');
        } catch (error) {
            console.error('Error toggling mute:', error);
            toast.error('Failed to toggle microphone');
        }
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        try {
            if (vapiRef.current && vapiRef.current.setVolume) {
                vapiRef.current.setVolume(newVolume);
            }
            const audioElements = document.querySelectorAll('audio');
            audioElements.forEach(audio => {
                audio.volume = newVolume;
            });
        } catch (error) {
            console.error('Error setting volume:', error);
        }
    };

    const stopInterview = () => {
        try {
            if (vapiRef.current) {
                vapiRef.current.stop();
                toast.info('Ending interview...');
            }
        } catch (error) {
            console.error('Error stopping interview:', error);
            toast.error('Error ending interview');
            void generateFeedback();
        }
    }

    const generateFeedback = async () => {
        if (feedbackRequestedRef.current) {
            return;
        }

        feedbackRequestedRef.current = true;
        setLoading(true);

        try {
            // Convert conversation array to string for API
            const conversationString = safeStringify(conversation);

            const result = await axios.post('/api/ai-feedback', {
                conversation: conversationString,
                interviewData: interviewInfo?.interviewData,
                userName: interviewInfo?.userName
            });

            console.log(result?.data);

            const Content = result?.data.content;

            let feedbackParsed;
            try {
                // Try parsing directly first
                feedbackParsed = JSON.parse(Content);
            } catch (directParseError) {
                // If direct parse fails, try extracting from code block
                const jsonMatch = Content.match(/```json([\s\S]*?)```/);
                const rawJSON = jsonMatch ? jsonMatch[1].trim() : Content;
                try {
                    feedbackParsed = JSON.parse(rawJSON);
                } catch (err) {
                    console.error("Failed to parse feedback JSON:", err);
                    toast.error("Failed to generate feedback");
                    setLoading(false);
                    return;
                }
            }

            const { data, error } = await supabase
                .from('interview-feedback')
                .insert([
                    {
                        userName: interviewInfo?.userName,
                        userEmail: interviewInfo?.userEmail,
                        interview_id: interview_id,
                        feedback: feedbackParsed,
                        recommended: false
                    },
                ])
                .select();

            if (error) {
                console.error("Supabase error:", error);
                toast.error("Failed to save feedback");
            } else {
                console.log(data);
                toast.success("Feedback generated successfully!");
            }

            setLoading(false);
            router.replace('/interview/' + interview_id + "/complete");
        } catch (error) {
            console.error("Error generating feedback:", error);
            toast.error("Failed to process interview");
            setLoading(false);
        }
    };

    return (
        <div className='h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden flex flex-col'>
            <StartInterviewHeader
                timer={formatTimer(timer)}
                jobPosition={interviewInfo?.interviewData?.jobPosition}
                language={languageDisplay}
                duration={durationDisplay}
                showCodeEditor={showCodeEditor}
                onToggleCodeEditor={() => setShowCodeEditor((prev) => !prev)}
            />

            {showTips && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4'>
                    <div className='relative w-full max-w-xl rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 shadow-2xl'>
                        <button
                            onClick={() => setShowTips(false)}
                            className='absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors'
                            aria-label='Close tips'
                        >
                            <X className='h-5 w-5' />
                        </button>

                        <div className='p-6 sm:p-8'>
                            <div className='mb-4 inline-flex rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300'>
                                Before you start
                            </div>

                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Read this first
                            </h2>

                            <p className='mt-3 text-sm sm:text-base leading-6 text-gray-600 dark:text-gray-300'>
                                Speak clearly, answer in complete sentences, and keep your microphone close. This helps the interviewer understand you properly.
                            </p>

                            <div className='mt-5 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/70 dark:bg-blue-900/20 p-4 text-sm text-blue-900 dark:text-blue-100'>
                                Tip: stay in a quiet place, avoid background noise, and wait for the AI to finish before answering.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className='flex-1 flex overflow-hidden '>
                <div
                    className='flex flex-col bg-gray-50 dark:bg-gray-900 transition-all duration-300 overflow-hidden'
                    style={{ width: showCodeEditor ? `${100 - editorWidth}%` : '100%' }}
                >
                    <div className='flex-1 overflow-y-auto px-28 py-10'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                            <InterviewParticipantCard
                                name='AI Interviewer'
                                isActive={!activeUser && isCallActive}
                                statusText='Speaking...'
                                idleText='Listening'
                            >
                                <div className='relative flex-shrink-0'>
                                    {!activeUser && isCallActive && (
                                        <>
                                            <span className='absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping scale-110' />
                                            <span className='absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping scale-105 animation-delay-75' />
                                        </>
                                    )}
                                    <div className='relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full'>
                                        <Image
                                            src='/ai.png'
                                            alt='AI Recruiter'
                                            width={48}
                                            height={48}
                                            className='w-12 h-12 rounded-full object-cover filter brightness-0 invert'
                                        />
                                    </div>
                                </div>
                            </InterviewParticipantCard>

                            <InterviewParticipantCard
                                name={interviewInfo?.userName || 'Candidate'}
                                isActive={activeUser && isCallActive}
                                statusText='Speaking...'
                                idleText='Listening'
                            >
                                <div className='relative flex-shrink-0'>
                                    {activeUser && isCallActive && (
                                        <>
                                            <span className='absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping scale-110' />
                                            <span className='absolute inset-0 rounded-full bg-green-500 opacity-50 animate-ping scale-105 animation-delay-75' />
                                        </>
                                    )}
                                    <div className='relative bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-full w-16 h-16 flex items-center justify-center'>
                                        <span className='text-xl font-bold text-white'>
                                            {interviewInfo?.userName?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                </div>
                            </InterviewParticipantCard>
                        </div>

                        <InterviewControls
                            isCallActive={isCallActive}
                            loading={loading}
                            callStarting={callStarting}
                            isMuted={isMuted}
                            showVolumeSlider={showVolumeSlider}
                            volume={volume}
                            onStart={startCall}
                            onToggleMute={toggleMute}
                            onEnd={stopInterview}
                            onToggleVolumeSlider={() => setShowVolumeSlider((prev) => !prev)}
                            onVolumeChange={handleVolumeChange}
                        />

                    </div>
                </div>

                <CodeEditorPanel
                    showCodeEditor={showCodeEditor}
                    editorWidth={editorWidth}
                    setEditorWidth={setEditorWidth}
                />
            </div>
        </div>
    )
}

export default StartInterview