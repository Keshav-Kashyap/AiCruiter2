"use client"
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { Loader2Icon, Mic, Phone, Timer, Volume2, VolumeX, Code2, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState, useRef } from 'react'
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supaBaseClient';
import CodeEditor from './_components/CodeEditor';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const vapiRef = useRef(null);
    const callEndReasonRef = useRef(null);
    const callFailedRef = useRef(false);
    const [activeUser, setActiveUser] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [typedAnswer, setTypedAnswer] = useState('');
    const [sendingTypedAnswer, setSendingTypedAnswer] = useState(false);
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
    const silenceTimerRef = useRef(null);
    const lastUserActivityRef = useRef(Date.now());
    const silencePromptsRef = useRef(0);

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

    // Format timer display
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const languageRaw = interviewInfo?.interviewData?.language || '';
    const languageDisplay = languageRaw ? (languageRaw.charAt(0).toUpperCase() + languageRaw.slice(1)) : '';

    const safeStringify = (value) => {
        const seen = new WeakSet();
        return JSON.stringify(value, (key, val) => {
            if (typeof val === 'object' && val !== null) {
                if (seen.has(val)) return '[Circular]';
                seen.add(val);
            }
            return val;
        });
    };

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
            setTypedAnswer('');

            // Clear any silence watcher timers
            clearSilenceWatcher();

            if (callFailedRef.current) {
                toast.error('Interview disconnected. Please restart and try again.');
                console.error('Call ended after a previous failure:', endReason);
                return;
            }

            const failedCall = endReason && /meeting has ended|room was deleted|no-room|eject|error/i.test(String(endReason));

            if (failedCall) {
                callFailedRef.current = true;
                toast.error('Interview disconnected. Please restart and try again.');
                console.error('Call ended due to failure reason:', endReason);
                return;
            }

            toast.success('Interview Completed');
            generateFeedback();
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

    // Helper functions
    function getDeepgramLangCode(lang) {
        if (!lang) return "en-US";
        switch (lang.toLowerCase()) {
            case "english":
                return "en-US";
            case "hindi":
                return "hi-IN";
            case "hinglish":
                return "hi-IN";
            default:
                return "en-US";
        }
    }

    function getOpenAIVoice(lang) {
        if (!lang) return "alloy";

        switch (lang.toLowerCase()) {
            case "english":
            case "hindi":
            case "hinglish":
                return "alloy";

            default:
                return "alloy";
        }
    }

    const sendTypedAnswer = async () => {
        const trimmedAnswer = typedAnswer.trim();

        if (!trimmedAnswer) {
            toast.error('Please type your answer before sending.');
            return;
        }

        if (!isCallActive || !vapiRef.current) {
            toast.error('Start the interview first, then send a typed answer.');
            return;
        }

        try {
            setSendingTypedAnswer(true);

            vapiRef.current.send({
                type: 'add-message',
                message: {
                    role: 'user',
                    content: trimmedAnswer,
                },
            });

            setConversation(prev => [
                ...prev,
                {
                    type: 'typed-response',
                    role: 'user',
                    content: trimmedAnswer,
                    timestamp: new Date().toISOString(),
                },
            ]);
            setTypedAnswer('');
            toast.success('Typed answer sent to the interviewer.');
        } catch (error) {
            console.error('Error sending typed answer:', error);
            toast.error('Failed to send your typed answer.');
        } finally {
            setSendingTypedAnswer(false);
        }
    };

    function getSystemPrompt(language, interviewInfo, questionList) {
        const jobPosition = interviewInfo?.interviewData?.jobPosition || "this position";
        const userName = interviewInfo?.userName || "Candidate";
        console.log("username", userName);

        switch (language.toLowerCase()) {
            case "hindi":
                return `
Aap ek professional AI voice assistant ho jo interviews conduct karta hai. Aapka kaam candidates se diye gaye interview questions puchna aur unke responses ko professionally assess karna hai.

Interview ki shuruaat is tarah karo:

"Hello ${userName}! Aapka ${jobPosition} position ke interview mein welcome hai. Main aaj aapka AI interviewer hoon. Kya aap ready hain?"

Important Instructions:
- Ek time par sirf ek question pucho
- Candidate ke response ka complete wait karo
- Questions clear aur professional hone chahiye
- Natural conversation maintain karo

Yahan questions diye gaye hain jo ek-ek karke puchne hain:
${questionList}

Response Guidelines:
- Agar candidate struggle kar raha ho to supportive hints do
- Har answer ke baad short acknowledgment do:
  "Achha", "Samajh gaya", "Very good", "Bahut badhiya", "Great answer"

- Encouraging aur professional tone maintain karo
- Jahan zarurat ho follow-up questions pucho
- Hindi aur English naturally mix karke baat karo
- Agar candidate type kar raha ho ya pause le raha ho, interview ko close mat karo.
- Patience se wait karo jab tak candidate apna answer submit na kare.
- Interview sirf tab conclude karo jab candidate explicitly bole ki wo finish kar chuka hai ya end interview kare.

Interview ko tabhi professionally conclude karo jab candidate explicitly finish kare:

"Thank you ${userName}! Aapne kaafi achhe answers diye hain. Hamari team aapse jaldi contact karegi."

Key Guidelines:
✅ Professional yet friendly tone
✅ Natural Hinglish conversation
✅ Clear pronunciation
✅ Appropriate pauses between questions
✅ Encouraging feedback
✅ Hindi aur English naturally mix karo
`.trim();

            case "english":
                return `
You are a professional AI voice assistant conducting job interviews. Your role is to ask candidates the provided interview questions and assess their responses professionally.

Begin the interview with:
"Hello ${userName}! Welcome to your ${jobPosition} interview. I'm your AI interviewer today. Are you ready to get started?"

Core Instructions:
- Ask ONE question at a time
- Wait completely for the candidate's response before proceeding
- Keep questions clear and professional
- Maintain natural conversation flow

Here are the questions to ask sequentially:
${questionList}

Response Guidelines:
- If candidate struggles, provide supportive hints without giving away answers
- Acknowledge each answer briefly: "Great", "I understand", "Excellent point"
- Maintain encouraging yet professional tone
- Ask follow-up questions when appropriate
- If the candidate is typing or pauses for a while, do not end the interview.
- Wait patiently until the candidate submits their answer.
- Only conclude when the candidate explicitly says they are done or wants to end the interview.

Conclude professionally only when the candidate explicitly finishes:
"Thank you ${userName}! You've provided some excellent insights. Our team will be in touch with you soon."

Key Guidelines:
✅ Professional, clear English
✅ Appropriate pacing and pauses
✅ Encouraging feedback
✅ Stay focused on interview objectives
✅ Maintain warm but professional demeanor
`.trim();

            case "hinglish":
                return `
Aap ek professional AI voice assistant ho jo interviews conduct karta hai. Aapka kaam candidates se diye gaye interview questions puchna aur unke responses ko professionally assess karna hai.

Interview ki shuruaat is tarah karo:

"Hello ${userName}! Aapka ${jobPosition} position ke interview mein welcome hai. Main aaj aapka AI interviewer hoon. Kya aap ready hain?"

Important Instructions:
- Ek time par sirf ek question pucho
- Candidate ke response ka complete wait karo
- Questions clear aur professional hone chahiye
- Natural conversation maintain karo

Yahan questions diye gaye hain jo ek-ek karke puchne hain:
${questionList}

Response Guidelines:
- Agar candidate struggle kar raha ho to supportive hints do
- Har answer ke baad short acknowledgment do:
  "Achha", "Samajh gaya", "Very good", "Bahut badhiya", "Great answer"

- Encouraging aur professional tone maintain karo
- Jahan zarurat ho follow-up questions pucho
- Hindi aur English naturally mix karke baat karo
- Agar candidate type kar raha ho ya pause le raha ho, interview close mat karo.
- Patiently wait karo jab tak candidate answer submit na kare.
- Interview sirf tab conclude karo jab candidate clearly bole ki wo done hai.

Interview ko tabhi professionally conclude karo jab candidate explicitly finish kare:

"Thank you ${userName}! Aapne kaafi achhe answers diye hain. Hamari team aapse jaldi contact karegi."

Key Guidelines:
✅ Professional yet friendly tone
✅ Natural Hinglish conversation
✅ Clear pronunciation
✅ Appropriate pauses between questions
✅ Encouraging feedback
✅ Hindi aur English naturally mix karo
`.trim();

            default:
                return `
You are a professional AI interviewer conducting a ${jobPosition} interview with ${userName}.

Ask questions one by one from: ${questionList}

Maintain professional, encouraging tone throughout.
If the candidate is typing or pauses for a while, keep waiting and do not close the interview.
Only conclude when the candidate explicitly finishes or asks to end the interview.
`.trim();
        }
    }

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
        setConversation([]);
        setTypedAnswer('');
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

            // Generate question list
            let questionList = "";
            if (interviewInfo?.interviewData?.questionList && interviewInfo.interviewData.questionList.length > 0) {
                interviewInfo.interviewData.questionList.forEach((item, index) => {
                    questionList += `${index + 1}. ${item?.question}\n`;
                });
            } else {
                // Default questions based on language
                const language = interviewInfo?.interviewData?.language || "english";
                if (language.toLowerCase() === "hindi") {
                    questionList = "1. अपने बारे में बताएं\n2. आपकी सबसे बड़ी शक्ति क्या है?\n3. आप यह नौकरी क्यों चाहते हैं?\n";
                } else {
                    questionList = "1. Tell me about yourself\n2. What are your greatest strengths?\n3. Why do you want this position?\n";
                }
            }

            const language = interviewInfo?.interviewData?.language || "english";
            const userName = interviewInfo?.userName || "Candidate";
            const jobPosition = interviewInfo?.interviewData?.jobPosition || "this position";

            // Language-specific first messages
            const getFirstMessage = (lang) => {
                switch (lang.toLowerCase()) {
                    case "hindi":
                        return `नमस्ते ${userName}! मैं आपका AI interviewer हूँ। ${jobPosition} position के लिए आपके interview में आपका स्वागत है। क्या आप ready हैं?`;
                    case "hinglish":
                        return `Hello ${userName}! Main आपका AI interviewer हूँ। ${jobPosition} position के लिए interview start करते हैं। Ready हैं?`;
                    case "english":
                        return `Hello ${userName}! I'm your AI interviewer. Welcome to your ${jobPosition} interview. Are you ready to begin?`;
                    default:
                        return `Hi ${userName}, I'm your AI interviewer. Ready for your ${jobPosition} interview?`;
                }
            };

            // Get voice configuration based on language
            const voiceConfig = {
                provider: "openai",
                model: "gpt-4o-mini-tts",
                voiceId: getOpenAIVoice(language),
                cachingEnabled: true
            };

            // Assistant configuration with proper voice and transcriber
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
                firstMessage: getFirstMessage(language)
            };

            console.log('Assistant LLM config:', assistantOptions.model);
            console.log('Assistant voice config:', assistantOptions.voice);
            console.log('Assistant transcriber config:', assistantOptions.transcriber);
            console.log('Assistant Configuration:', JSON.stringify(assistantOptions, null, 2));

            // Start the call using vapiRef
            console.log('Attempting to start VAPI call...');
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
            // Still try to generate feedback
            generateFeedback();
        }
    }

    const generateFeedback = async () => {
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
            {/* Top Header Bar */}
            <div className='bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700'>
                <div className='px-6 py-4'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div className='flex-1'>
                            <div className='flex items-center gap-3'>
                                <h1 className='text-xl lg:text-2xl font-bold text-gray-900 dark:text-white'>
                                    AI Interview Session
                                </h1>
                                <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg'>
                                    <Timer className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                                    <span className='text-sm font-mono font-semibold text-gray-900 dark:text-white'>
                                        {formatTime(timer)}
                                    </span>
                                </div>
                            </div>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                {interviewInfo?.interviewData?.jobPosition} • {interviewInfo?.interviewData?.language?.charAt(0).toUpperCase() + interviewInfo?.interviewData?.language?.slice(1)}
                            </p>
                        </div>

                        <button
                            onClick={() => setShowCodeEditor(!showCodeEditor)}
                            className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium'
                        >
                            <Code2 className='w-4 h-4' />
                            {showCodeEditor ? 'Hide' : 'Show'} Code Editor
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Split View */}
            <div className='flex-1 flex overflow-hidden'>
                {/* Interview Section */}
                <div
                    className='flex flex-col bg-gray-50 dark:bg-gray-900 transition-all duration-300'
                    style={{ width: showCodeEditor ? `${100 - editorWidth}%` : '100%' }}
                >
                    <div className='flex-1 overflow-y-auto p-6'>
                        {/* AI Recruiter and User Cards - Compact Horizontal Layout */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                            {/* AI Recruiter Card */}
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
                                <div className='p-6 flex items-center gap-4'>
                                    <div className='relative flex-shrink-0'>
                                        {!activeUser && isCallActive && (
                                            <>
                                                <span className='absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping scale-110' />
                                                <span className='absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping scale-105 animation-delay-75' />
                                            </>
                                        )}
                                        <div className='relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full'>
                                            <Image
                                                src={'/ai.png'}
                                                alt="AI Recruiter"
                                                width={48}
                                                height={48}
                                                className='w-12 h-12 rounded-full object-cover filter brightness-0 invert'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                                            AI Interviewer
                                        </h3>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <div className={`w-2 h-2 rounded-full ${!activeUser && isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>
                                                {!activeUser && isCallActive ? 'Speaking...' : 'Listening'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Card */}
                            <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
                                <div className='p-6 flex items-center gap-4'>
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
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
                                            {interviewInfo?.userName || 'Candidate'}
                                        </h3>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <div className={`w-2 h-2 rounded-full ${activeUser && isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                            <span className='text-xs text-gray-600 dark:text-gray-400'>
                                                {activeUser && isCallActive ? 'Speaking...' : 'Listening'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6'>
                            <div className='flex items-center justify-center gap-6 mb-6'>
                                {/* Start Interview Button */}
                                {!isCallActive && !loading && (
                                    <button
                                        onClick={startCall}
                                        disabled={callStarting}
                                        className={`group relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl ${callStarting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600 shadow-green-500/40'
                                            } text-white`}
                                    >
                                        {callStarting ? (
                                            <Loader2Icon className='h-7 w-7 animate-spin' />
                                        ) : (
                                            <Phone className='h-7 w-7' />
                                        )}
                                        <span className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'>
                                            {callStarting ? 'Starting...' : 'Start Interview'}
                                        </span>
                                    </button>
                                )}

                                {/* Mute Button */}
                                {isCallActive && (
                                    <button
                                        onClick={toggleMute}
                                        className={`group relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isMuted
                                            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                                            : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-lg shadow-gray-500/30'
                                            }`}
                                    >
                                        {isMuted ? (
                                            <VolumeX className='h-6 w-6 text-white' />
                                        ) : (
                                            <Mic className='h-6 w-6 text-white' />
                                        )}
                                        <span className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                            {isMuted ? 'Unmute' : 'Mute'}
                                        </span>
                                    </button>
                                )}

                                {/* End Call Button */}
                                {isCallActive && !loading && (
                                    <button
                                        onClick={stopInterview}
                                        className='group relative h-16 w-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl shadow-red-500/40'
                                    >
                                        <Phone className='h-7 w-7 rotate-[135deg]' />
                                        <span className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'>
                                            End Interview
                                        </span>
                                    </button>
                                )}

                                {/* Loading Indicator */}
                                {loading && (
                                    <div className='h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center'>
                                        <Loader2Icon className='h-7 w-7 animate-spin text-gray-600 dark:text-gray-300' />
                                    </div>
                                )}

                                {/* Volume Button */}
                                {isCallActive && (
                                    <div className='relative'>
                                        <button
                                            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                                            className='group relative h-14 w-14 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-blue-500/30'
                                        >
                                            <Volume2 className='h-6 w-6' />
                                            <span className='absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                                Volume
                                            </span>
                                        </button>

                                        {showVolumeSlider && (
                                            <div className='absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border dark:border-gray-600'>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={volume}
                                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                                    className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                />
                                                <div className='text-xs text-center mt-1 text-gray-600 dark:text-gray-300'>
                                                    {Math.round(volume * 100)}%
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                                            <div className='max-w-3xl mx-auto mb-6'>
                                                <p className='text-sm text-center text-gray-500 dark:text-gray-400'>
                                                    Typing input removed for production; please use voice to answer during the interview.
                                                </p>
                                            </div>

                            {/* Status Text */}
                            <div className='text-center'>
                                {loading ? (
                                    <p className='text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center gap-2'>
                                        <Loader2Icon className='h-4 w-4 animate-spin' />
                                        Generating Feedback...
                                    </p>
                                ) : callStarting ? (
                                    <p className='text-orange-600 dark:text-orange-400 font-medium flex items-center justify-center gap-2'>
                                        <Loader2Icon className='h-4 w-4 animate-spin' />
                                        Initializing Interview...
                                    </p>
                                ) : isCallActive ? (
                                    <div className='text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2'>
                                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                                        <span>Interview in Progress</span>
                                    </div>
                                ) : (
                                    <div className='space-y-2'>
                                        <p className='text-gray-900 dark:text-white font-medium'>
                                            Ready to Start Professional Interview
                                        </p>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            Click the green button to begin • Use code editor for technical questions
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className='mt-8 text-center'>
                            {!isCallActive ? (
                                <div className='space-y-3'>
                                    <p className='text-gray-700 dark:text-gray-300 font-medium'>
                                        Interview for: {interviewInfo?.interviewData?.jobPosition || 'Loading...'}
                                    </p>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        Make sure your microphone is working and you're in a quiet environment
                                    </p>
                                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto'>
                                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-blue-700 dark:text-blue-300'>
                                            <div className='text-center'>
                                                <strong>📝 Professional Tips:</strong>
                                                <p className='mt-1'>Speak clearly and take your time</p>
                                            </div>
                                            <div className='text-center'>
                                                <strong>🎯 Language:</strong>
                                                <p className='mt-1'>{interviewInfo?.interviewData?.language?.charAt(0).toUpperCase() + interviewInfo?.interviewData?.language?.slice(1) || "English"}</p>
                                            </div>
                                            <div className='text-center'>
                                                <strong>⏱️ Duration:</strong>
                                                <p className='mt-1'>Max 30 minutes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='space-y-2'>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        Your interview is being professionally recorded and analyzed
                                    </p>
                                    <p className='text-xs text-gray-400 dark:text-gray-500'>
                                        Use the mute button if you need a moment to think
                                    </p>
                                    <div className='flex justify-center items-center gap-4 mt-4'>
                                        <div className='text-xs text-gray-500'>
                                            Questions: {interviewInfo?.interviewData?.questionList?.length || 'Default'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Code Editor Section */}
                    {showCodeEditor && (
                        <>
                            {/* Resize Handle */}
                            <div
                                className='w-1 bg-gray-300 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-500 cursor-col-resize transition-colors'
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const startX = e.clientX;
                                    const startWidth = editorWidth;

                                    const handleMouseMove = (e) => {
                                        const diff = startX - e.clientX;
                                        const newWidth = Math.min(Math.max(startWidth + (diff / window.innerWidth) * 100, 30), 70);
                                        setEditorWidth(newWidth);
                                    };

                                    const handleMouseUp = () => {
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                            />

                            {/* Code Editor Panel */}
                            <div
                                className='bg-gray-900 overflow-hidden'
                                style={{ width: `${editorWidth}%` }}
                            >
                                <CodeEditor />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StartInterview