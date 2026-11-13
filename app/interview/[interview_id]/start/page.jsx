"use client"

import React, { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Vapi from '@vapi-ai/web';
import axios from 'axios';
import { toast } from 'sonner';
import { X, AlertTriangle } from 'lucide-react';

import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { supabase } from '@/services/supaBaseClient';

import StartInterviewHeader from './_components/StartInterviewHeader';
import InterviewParticipantCard from './_components/InterviewParticipantCard';
import InterviewControls from './_components/InterviewControls';
import CodeEditorPanel from './_components/CodeEditorPanel';
import FeedbackGeneratingLoader from './_components/FeedbackGeneratingLoader';
import {
    buildQuestionList,
    formatLanguageLabel,
    formatTimer,
    getDeepgramLangCode,
    getFirstMessage,
    getOpenAIVoice,
    getSystemPrompt,
} from './_components/interviewSessionHelpers';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const { interview_id } = useParams();
    const router = useRouter();

    const vapiRef = useRef(null);
    const feedbackSentRef = useRef(false);
    const reminderWarnedRef = useRef(false);
    const timeUpWarnedRef = useRef(false);
    const conversationRef = useRef([]);
    const insertedRecordIdRef = useRef(null);
    const interviewInfoRef = useRef(interviewInfo);

    useEffect(() => {
        interviewInfoRef.current = interviewInfo;
    }, [interviewInfo]);

    // Helper to reliably get current session details (handling closures and sessionStorage fallback)
    const getSessionInfo = () => {
        let session = interviewInfoRef.current || interviewInfo;
        if (!session?.userName || !session?.userEmail) {
            if (typeof window !== 'undefined') {
                try {
                    const storedSession = sessionStorage.getItem('interviewSession');
                    if (storedSession) {
                        const parsed = JSON.parse(storedSession);
                        if (parsed) {
                            session = { ...parsed, ...session };
                        }
                    }
                } catch (e) {
                    console.error("Error parsing stored interview session:", e);
                }
            }
        }
        return session || {};
    };

    const [conversation, setConversation] = useState([]);
    const [activeUser, setActiveUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState(5);
    const [volume, setVolume] = useState(0.8);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [callStarting, setCallStarting] = useState(false);
    const [showCodeEditor, setShowCodeEditor] = useState(false);
    const [editorWidth, setEditorWidth] = useState(45);
    const [showTips, setShowTips] = useState(true);

    // Multi-step feedback loading state
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
    const [feedbackStep, setFeedbackStep] = useState(0);
    const [feedbackError, setFeedbackError] = useState(null);

    // Sync duration from interview info if available
    useEffect(() => {
        const rawDuration = interviewInfo?.interviewData?.duration;
        if (rawDuration) {
            const parsed = parseInt(rawDuration);
            if (!isNaN(parsed) && parsed > 0) {
                setDurationMinutes(parsed);
            }
        }
    }, [interviewInfo]);

    // Interview Timer effect
    useEffect(() => {
        let interval;
        if (isCallActive) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isCallActive]);

    const totalDurationSeconds = durationMinutes * 60;
    const remainingSeconds = Math.max(0, totalDurationSeconds - timer);

    const handleExtendDuration = (extraMins = 5) => {
        setDurationMinutes(prev => {
            const newMins = prev + extraMins;
            toast.success(`Interview duration extended by ${extraMins} minutes!`, {
                description: `Total duration is now ${newMins} minutes.`,
            });
            return newMins;
        });
    };

    // Reminder notification when 1 minute remaining
    useEffect(() => {
        if (!isCallActive) {
            reminderWarnedRef.current = false;
            timeUpWarnedRef.current = false;
            return;
        }

        if (remainingSeconds > 60) {
            reminderWarnedRef.current = false;
            timeUpWarnedRef.current = false;
        }

        if (remainingSeconds <= 60 && remainingSeconds > 0 && !reminderWarnedRef.current) {
            reminderWarnedRef.current = true;
            toast.warning('1 Minute Remaining!', {
                duration: 8000,
                description: 'Only 1 minute left in your interview session. Extend time if needed.',
                action: {
                    label: '+5 Min Extend',
                    onClick: () => handleExtendDuration(5),
                },
            });
        }

        if (remainingSeconds <= 0 && !timeUpWarnedRef.current) {
            timeUpWarnedRef.current = true;
            toast.error('Interview Time Limit Reached!', {
                duration: 10000,
                description: 'Your allotted interview time has ended.',
                action: {
                    label: '+5 Min Extend',
                    onClick: () => handleExtendDuration(5),
                },
            });
        }
    }, [timer, isCallActive, remainingSeconds]);

    const currentSessionInfo = getSessionInfo();
    const languageRaw = currentSessionInfo?.interviewData?.language || '';
    const languageDisplay = formatLanguageLabel(languageRaw);

    // Save raw conversation immediately to Supabase
    const saveRawConversationImmediately = async (conv) => {
        if (!conv || conv.length === 0) return;
        const currentSession = getSessionInfo();
        const userName = currentSession?.userName || 'Candidate';
        const userEmail = currentSession?.userEmail || '';
        try {
            const { data, error } = await supabase
                .from('interview-feedback')
                .insert([
                    {
                        userName: userName,
                        userEmail: userEmail,
                        interview_id: interview_id,
                        raw_conversation: conv,
                        feedback: null,
                        recommended: false
                    }
                ])
                .select('id');

            if (error) {
                console.error('Error saving raw conversation immediately:', error);
            } else if (data?.[0]?.id) {
                insertedRecordIdRef.current = data[0].id;
                console.log('Raw conversation saved immediately with ID:', data[0].id, 'userName:', userName, 'userEmail:', userEmail);
            }
        } catch (err) {
            console.error('Failed to save raw conversation:', err);
        }
    };

    // Restore session from sessionStorage if needed
    useEffect(() => {
        if (interviewInfo?.userName && interviewInfo?.userEmail && interviewInfo?.interviewData) return;

        if (typeof window !== 'undefined') {
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
        }
    }, [interviewInfo, setInterviewInfo]);

    // Initialize Vapi and setup event listeners
    useEffect(() => {
        const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        if (!vapiKey) {
            console.error('VAPI key missing');
            return;
        }

        if (!vapiRef.current) {
            vapiRef.current = new Vapi(vapiKey);
        }

        const vapi = vapiRef.current;

        const hasValidConversation = (conv) => {
            if (!Array.isArray(conv) || conv.length === 0) return false;
            return conv.some(msg => {
                if (!msg) return false;
                const text = msg.content || msg.message || msg.text || '';
                return text.trim().length > 0 && (msg.role === 'user' || msg.role === 'assistant');
            });
        };

        const handleCallStart = () => {
            setIsCallActive(true);
            setCallStarting(false);
            setTimer(0);
            setConversation([]);
            conversationRef.current = [];
            insertedRecordIdRef.current = null;
        };

        const handleCallEnd = async () => {
            setIsCallActive(false);
            setCallStarting(false);
            setActiveUser(false);

            const finalConversation = conversationRef.current?.length > 0 
                ? conversationRef.current 
                : conversation;

            console.log("FINAL CONVERSATION AT CALL END:", finalConversation);
            
            if (!hasValidConversation(finalConversation)) {
                toast.error("Connection failure or interview could not be completed. Please try again after some time.", { duration: 6000 });
                return;
            }

            // Save raw conversation right away so conversation is never lost
            await saveRawConversationImmediately(finalConversation);

            void generateFeedback(finalConversation);
        };

        const handleSpeechStart = () => setActiveUser(false);
        const handleSpeechEnd = () => setActiveUser(true);

        const handleError = (error) => {
            console.error('VAPI Error:', error);
            setCallStarting(false);
            setIsCallActive(false);

            const finalConversation = conversationRef.current?.length > 0 
                ? conversationRef.current 
                : conversation;

            if (!hasValidConversation(finalConversation)) {
                toast.error('Connection failure. Please try again after some time.', { duration: 6000 });
                return;
            }

            toast.error('Connection issue in interview call');
            void generateFeedback(finalConversation);
        };

        vapi.on('call-start', handleCallStart);
        vapi.on('call-end', handleCallEnd);
        vapi.on('speech-start', handleSpeechStart);
        vapi.on('speech-end', handleSpeechEnd);
        vapi.on('error', handleError);
        vapi.on("message", (message) => {
            const currentConversation = message?.conversation;
            if (Array.isArray(currentConversation) && currentConversation.length > 0) {
                console.log("conversation updated:", currentConversation);
                setConversation(currentConversation);
                conversationRef.current = currentConversation;
            }
        });

        return () => {
            if (vapi) {
                vapi.off('call-start', handleCallStart);
                vapi.off('call-end', handleCallEnd);
                vapi.off('speech-start', handleSpeechStart);
                vapi.off('speech-end', handleSpeechEnd);
                vapi.off('error', handleError);
            }
        };
    }, []);

    const startCall = async () => {
        const currentSession = getSessionInfo();
        if (!currentSession?.interviewData) {
            toast.error('Interview information not loaded');
            return;
        }
        console.log("interview details", currentSession);

        const vapiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

        if (!vapiKey) {
            console.log('Vapi Key is not found');
            return;
        }

        if (callStarting || isCallActive) return;

        const targetAssistantId =
            process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

        if (!targetAssistantId) {
            console.log('VAPI Assistant ID not found');
            return;
        }

        setCallStarting(true);
        feedbackSentRef.current = false;

        try {
            const language = currentSession?.interviewData?.language || 'English';
            const userName = currentSession?.userName || 'Candidate';    
            const jobPosition = currentSession?.interviewData?.jobPosition || 'Software Eng';
            const questionList = buildQuestionList(currentSession?.interviewData);
            // console.log("language:",language)
            // console.log("usernmae:",userName)
            // console.log("jobPosition:",jobPosition)
            // console.log("questionList:",questionList)
            await vapiRef.current.start(
                targetAssistantId,
                {
                    variableValues: {
                        userName,
                        jobPosition,
                        language,
                        questionList,
                    },
                    maxDurationSeconds: durationMinutes * 60,
                }
            );

        } catch (error) {
            console.error('Error starting call:', error);

            setCallStarting(false);
            setIsCallActive(false);

            toast.error('Connection failure while starting interview. Please try again after some time.', { duration: 6000 });
        }
    };

    const toggleMute = () => {
        if (!isCallActive || !vapiRef.current) return;
        try {
            vapiRef.current.setMuted(!isMuted);
            setIsMuted(!isMuted);
            toast.info(!isMuted ? 'Microphone Muted' : 'Microphone Unmuted');
        } catch (error) {
            console.error('Mute error:', error);
        }
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        try {
            if (vapiRef.current?.setVolume) {
                vapiRef.current.setVolume(newVolume);
            }
        } catch (error) {
            console.error('Volume change error:', error);
        }
    };

    const stopInterview = () => {
        try {
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        } catch (error) {
            console.error('Error stopping interview:', error);
            const finalConversation = conversationRef.current?.length > 0 
                ? conversationRef.current 
                : conversation;

            const isConversationValid = Array.isArray(finalConversation) && finalConversation.some(msg => {
                if (!msg) return false;
                const text = msg.content || msg.message || msg.text || '';
                return text.trim().length > 0 && (msg.role === 'user' || msg.role === 'assistant');
            });

            if (!isConversationValid) {
                toast.error('Interview could not be completed. Please try again after some time.', { duration: 6000 });
                return;
            }

            void generateFeedback(finalConversation);
        }
    };

    const generateFeedback = async (conversationData) => {
        if (feedbackSentRef.current) return;

        const finalConversation = (Array.isArray(conversationData) && conversationData.length > 0)
            ? conversationData
            : (Array.isArray(conversationRef.current) && conversationRef.current.length > 0
                ? conversationRef.current
                : (Array.isArray(conversation) ? conversation : []));

        const isConversationValid = Array.isArray(finalConversation) && finalConversation.some(msg => {
            if (!msg) return false;
            const text = msg.content || msg.message || msg.text || '';
            return text.trim().length > 0 && (msg.role === 'user' || msg.role === 'assistant');
        });

        if (!isConversationValid) {
            console.warn("No valid conversation recorded. Aborting feedback generation.");
            toast.error("Connection failure or interview could not be completed. Please try again after some time.", { duration: 6000 });
            setLoading(false);
            setIsGeneratingFeedback(false);
            setIsCallActive(false);
            setCallStarting(false);
            feedbackSentRef.current = false;
            return;
        }

        feedbackSentRef.current = true;
        setLoading(true);
        setIsGeneratingFeedback(true);
        setFeedbackError(null);
        setFeedbackStep(0); // Step 0: Securing conversation data...

        // Ensure raw conversation is saved immediately if not already saved
        if (!insertedRecordIdRef.current && finalConversation.length > 0) {
            await saveRawConversationImmediately(finalConversation);
        }

        setFeedbackStep(1); // Step 1: Transcribing and indexing response...

        try {
            setFeedbackStep(2); // Step 2: Evaluating technical depth...
            console.log("CONVERSATION SENT TO AI:", finalConversation);

            const currentSession = getSessionInfo();
            const userName = currentSession?.userName || 'Candidate';
            const userEmail = currentSession?.userEmail || '';

            const result = await axios.post('/api/ai-feedback', {
                conversation: finalConversation,
                interviewData: currentSession?.interviewData,
                userName: userName
            });

            setFeedbackStep(3); // Step 3: Assessing communication clarity...

            const content = result?.data?.content;
            console.log("RAW AI RESPONSE:", content);

            if (!content) {
                throw new Error("AI feedback response is empty");
            }

            let feedbackParsed;

            try {
                feedbackParsed = JSON.parse(content);
            } catch (error) {
                const jsonMatch = content?.match(/```json([\s\S]*?)```/);
                const rawJSON = jsonMatch ? jsonMatch[1].trim() : content;
                feedbackParsed = JSON.parse(rawJSON);
            }

            const isRecommended = Boolean(
                feedbackParsed?.feedback?.recommendation ?? 
                feedbackParsed?.recommendation ?? 
                false
            );

            setFeedbackStep(4); // Step 4: Finalizing recommendation & score...

            if (insertedRecordIdRef.current) {
                const { error: updateErr } = await supabase
                    .from('interview-feedback')
                    .update({
                        userName: userName,
                        userEmail: userEmail,
                        feedback: feedbackParsed,
                        recommended: isRecommended
                    })
                    .eq('id', insertedRecordIdRef.current);

                if (updateErr) {
                    console.error("Error updating feedback record:", updateErr);
                }
            } else {
                await supabase.from('interview-feedback').insert([
                    {
                        userName: userName,
                        userEmail: userEmail,
                        interview_id: interview_id,
                        feedback: feedbackParsed,
                        recommended: isRecommended,
                        raw_conversation: finalConversation
                    }
                ]);
            }

            // Brief pause to let user see final step complete checkmark
            setTimeout(() => {
                router.replace(`/interview/${interview_id}/complete`);
            }, 800);

        } catch (error) {
            console.error("Error generating feedback:", error);
            setFeedbackError(error?.message || "Failed to process interview feedback.");
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-hidden flex flex-col">
            <StartInterviewHeader
                timer={formatTimer(timer)}
                remainingSeconds={remainingSeconds}
                durationMinutes={durationMinutes}
                isCallActive={isCallActive}
                jobPosition={interviewInfo?.interviewData?.jobPosition}
                language={languageDisplay}
                showCodeEditor={showCodeEditor}
                onToggleCodeEditor={() => setShowCodeEditor((prev) => !prev)}
                onExtendDuration={handleExtendDuration}
            />

            {/* Warning Alert Banner when <= 1 minute left */}
            {isCallActive && remainingSeconds <= 60 && (
                <div className={`px-4 py-2 flex items-center justify-between text-xs sm:text-sm font-semibold shadow-sm transition-colors ${
                    remainingSeconds <= 0
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-amber-500 text-white animate-pulse'
                }`}>
                    <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-4 w-4 flex-shrink-0' />
                        <span>
                            {remainingSeconds <= 0
                                ? 'Interview time limit reached! Click "+ Add 5 Mins" to extend.'
                                : `Reminder: Only ${remainingSeconds} seconds left in this interview session!`}
                        </span>
                    </div>
                    <button
                        onClick={() => handleExtendDuration(5)}
                        className='bg-white text-gray-900 px-3 py-1 rounded-md text-xs font-bold hover:bg-amber-50 transition-colors shadow-sm'
                    >
                        + Add 5 Mins
                    </button>
                </div>
            )}

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

            <div className='flex-1 flex overflow-hidden'>
                <div
                    className='flex flex-col bg-gray-50 dark:bg-gray-900 transition-all duration-300 overflow-hidden'
                    style={{ width: showCodeEditor ? `${100 - editorWidth}%` : '100%' }}
                >
                    <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
                        <div className='w-full max-w-[1400px] mx-auto'>
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
                                    name={getSessionInfo()?.userName || 'Candidate'}
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
                                                {(getSessionInfo()?.userName || 'Candidate')?.[0]?.toUpperCase()}
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
                                onExtendDuration={handleExtendDuration}
                                remainingSeconds={remainingSeconds}
                            />
                        </div>
                    </div>
                </div>

                <CodeEditorPanel
                    showCodeEditor={showCodeEditor}
                    editorWidth={editorWidth}
                    setEditorWidth={setEditorWidth}
                />
            </div>

            {isGeneratingFeedback && (
                <FeedbackGeneratingLoader
                    currentStep={feedbackStep}
                    error={feedbackError}
                    onRetry={() => {
                        feedbackSentRef.current = false;
                        void generateFeedback();
                    }}
                />
            )}
        </div>
    );
};

export default StartInterview;