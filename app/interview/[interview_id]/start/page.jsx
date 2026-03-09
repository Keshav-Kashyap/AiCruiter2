"use client"
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { Loader2Icon, Mic, Phone, Timer, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState, useRef } from 'react'
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supaBaseClient';

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const vapiRef = useRef(null);
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

    // Initialize Vapi instance once
    useEffect(() => {
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY_HINDI);
        
        return () => {
            if (vapiRef.current) {
                try {
                    vapiRef.current.stop();
                } catch (error) {
                    console.error('Cleanup error:', error);
                }
            }
        };
    }, []);

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

    // Setup Vapi event listeners
    useEffect(() => {
        if (!vapiRef.current) return;

        const handleMessage = (message) => {
            console.log('Message', message);
            if (message?.conversation) {
                setConversation(prev => [...prev, message]);
            }
        }

        const handleCallStart = () => {
            console.log('Call started');
            setIsCallActive(true);
            setCallStarting(false);
            setTimer(0);
            toast.success('Interview Started Successfully!');
        };

        const handleCallEnd = () => {
            console.log('Call ended');
            setIsCallActive(false);
            setCallStarting(false);
            setActiveUser(false);
            toast.success('Interview Completed');
            // Generate feedback after call ends
            generateFeedback();
        };

        const handleSpeechStart = () => {
            console.log('AI started speaking');
            setActiveUser(false);
        };

        const handleSpeechEnd = () => {
            console.log('AI finished speaking');
            setActiveUser(true);
        };

        const handleError = (error) => {
            console.error('VAPI Error:', error);
            setCallStarting(false);
            setIsCallActive(false);
            setLoading(false);
            toast.error('Failed to start interview. Please try again.');
        };

        // Register event handlers
        vapiRef.current.on('message', handleMessage);
        vapiRef.current.on('call-start', handleCallStart);
        vapiRef.current.on('call-end', handleCallEnd);
        vapiRef.current.on('speech-start', handleSpeechStart);
        vapiRef.current.on('speech-end', handleSpeechEnd);
        vapiRef.current.on('error', handleError);

        return () => {
            // Cleanup event listeners
            if (vapiRef.current) {
                vapiRef.current.off('message', handleMessage);
                vapiRef.current.off('call-start', handleCallStart);
                vapiRef.current.off('call-end', handleCallEnd);
                vapiRef.current.off('speech-start', handleSpeechStart);
                vapiRef.current.off('speech-end', handleSpeechEnd);
                vapiRef.current.off('error', handleError);
            }
        }
    }, []);

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

    function getPlayhtVoice(lang) {
        if (!lang) return "jennifer";
        switch (lang.toLowerCase()) {
            case "english":
                return "jennifer";
            case "hindi":
                return "ananya";
            case "hinglish":
                return "ananya";
            default:
                return "jennifer";
        }
    }

    function getSystemPrompt(language, interviewInfo, questionList) {
        const jobPosition = interviewInfo?.interviewData?.jobPosition || "this position";
        const userName = interviewInfo?.userName || "Candidate";
        console.log("username", userName);

        switch (language.toLowerCase()) {
            case "hindi":
                return `
आप एक professional AI voice assistant हैं जो interviews conduct करते हैं। आपका काम है candidates को दिए गए interview questions पूछना और उनके responses को assess करना।

Interview की शुरुआत इस तरह करें:
"नमस्ते ${userName}! आपका ${jobPosition} position के लिए interview में स्वागत है। मैं आपका AI interviewer हूँ। क्या आप तैयार हैं?"

महत्वपूर्ण निर्देश:
- एक समय में सिर्फ एक question पूछें
- Candidate के response का पूरा इंतज़ार करें
- Questions को clear और professional रखें
- Natural conversation maintain करें

यहाँ हैं questions जो एक-एक करके पूछने हैं:
${questionList}

Response Guidelines:
- अगर candidate struggle कर रहा है, तो supportive hints दें
- हर answer के बाद brief acknowledgment दें: "अच्छा", "समझ गया", "बहुत बढ़िया"
- Encouraging लेकिन professional tone maintain करें
- Follow-up questions पूछें जहाँ appropriate हो

Interview को 5-7 questions के बाद professionally conclude करें:
"धन्यवाद ${userName}! आपने बहुत अच्छे answers दिए हैं। हमारी team आपसे जल्दी contact करेगी।"

Key Guidelines:
✅ Professional yet friendly tone
✅ Clear Hindi pronunciation
✅ Appropriate pauses between questions
✅ Encouraging feedback
✅ पूरी बातचीत Hindi में करें
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

Conclude professionally after 5-7 questions:
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
आप एक professional AI interviewer हैं। आप Hindi और English दोनों mix करके naturally बात कर सकते हैं।

Interview start करें:
"Hello ${userName}! Welcome to your ${jobPosition} का interview। Main आपका AI interviewer हूँ। Ready हैं आप?"

Instructions:
- एक time पर एक ही question पूछें
- Candidate का complete response wait करें
- Natural Hinglish use करें जैसे normally बोलते हैं

Questions:
${questionList}

Response style:
- "Achha, very good!", "Bilkul right!", "Great answer!"
- Supportive hints दें अगर need हो
- Natural conversation maintain करें
- Mix Hindi-English comfortably

Conclude करें:
"Thank you ${userName}! Bahut achhe answers दिए हैं आपने। Team आपको soon contact करेगी।"

Key Guidelines:
✅ Natural Hinglish flow
✅ Professional yet friendly
✅ Clear pronunciation दोनों languages में
✅ Encouraging feedback
`.trim();

            default:
                return `
You are a professional AI interviewer conducting a ${jobPosition} interview with ${userName}.

Ask questions one by one from: ${questionList}

Maintain professional, encouraging tone throughout.
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

        // Check if already starting or active
        if (callStarting || isCallActive) {
            return;
        }

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
                provider: "playht",
                voiceId: getPlayhtVoice(language)
            };

            // Assistant configuration with proper voice and transcriber
            const assistantOptions = {
                model: {
                    provider: "openai",
                    model: "gpt-3.5-turbo",
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

            console.log('Assistant Configuration:', JSON.stringify(assistantOptions, null, 2));

            // Start the call using vapiRef
            console.log('Attempting to start VAPI call...');
            const result = await vapiRef.current.start(assistantOptions);
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
            const conversationString = JSON.stringify(conversation);

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
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
            <div className='container mx-auto px-4 py-8 lg:px-8 xl:px-16'>
                {/* Header */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                                AI Interview Session
                            </h1>
                            <p className='text-gray-600 dark:text-gray-400'>
                                {interviewInfo?.interviewData?.jobPosition} Position Interview
                            </p>
                            <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
                                Language: {interviewInfo?.interviewData?.language?.charAt(0).toUpperCase() + interviewInfo?.interviewData?.language?.slice(1) || "English"}
                            </p>
                        </div>

                        <div className='flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg'>
                            <Timer className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                            <span className='text-lg font-mono font-semibold text-gray-900 dark:text-white'>
                                {formatTime(timer)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Interview Interface */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    {/* AI Recruiter Card */}
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300'>
                        <div className='h-80 flex items-center flex-col gap-6 justify-center p-8'>
                            <div className='relative'>
                                {!activeUser && isCallActive && (
                                    <>
                                        <span className='absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping scale-110' />
                                        <span className='absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping scale-105 animation-delay-75' />
                                    </>
                                )}
                                <div className='relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full'>
                                    <Image
                                        src={'/ai.png'}
                                        alt="AI Recruiter"
                                        width={80}
                                        height={80}
                                        className='w-16 h-16 rounded-full object-cover filter brightness-0 invert'
                                    />
                                </div>
                            </div>

                            <div className='text-center'>
                                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                    AI Professional Recruiter
                                </h3>
                                <div className='flex items-center justify-center gap-2'>
                                    <div className={`w-2 h-2 rounded-full ${!activeUser && isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                        {!activeUser && isCallActive ? 'Speaking...' : 'Listening'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Card */}
                    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300'>
                        <div className='h-80 flex-col gap-6 flex items-center justify-center p-8'>
                            <div className='relative'>
                                {activeUser && isCallActive && (
                                    <>
                                        <span className='absolute inset-0 rounded-full bg-green-500 opacity-30 animate-ping scale-110' />
                                        <span className='absolute inset-0 rounded-full bg-green-500 opacity-50 animate-ping scale-105 animation-delay-75' />
                                    </>
                                )}
                                <div className='relative bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-full'>
                                    <span className='text-2xl font-bold text-white'>
                                        {interviewInfo?.userName?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>

                            <div className='text-center'>
                                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                                    {interviewInfo?.userName || 'Candidate'}
                                </h3>
                                <div className='flex items-center justify-center gap-2'>
                                    <div className={`w-2 h-2 rounded-full ${activeUser && isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                        {activeUser && isCallActive ? 'Speaking...' : 'Listening'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-colors duration-300'>
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
                            <p className='text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                                Interview in Progress
                            </p>
                        ) : (
                            <div className='space-y-2'>
                                <p className='text-gray-900 dark:text-white font-medium'>
                                    Ready to Start Professional Interview
                                </p>
                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                    Click the green button to begin
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
                                        <strong>Professional Tips:</strong>
                                        <p className='mt-1'>Speak clearly and take your time</p>
                                    </div>
                                    <div className='text-center'>
                                        <strong>Language:</strong>
                                        <p className='mt-1'>{interviewInfo?.interviewData?.language?.charAt(0).toUpperCase() + interviewInfo?.interviewData?.language?.slice(1) || "English"}</p>
                                    </div>
                                    <div className='text-center'>
                                        <strong>Duration:</strong>
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
                                <div className='text-xs text-gray-500'>
                                    Language: {interviewInfo?.interviewData?.language?.charAt(0).toUpperCase() + interviewInfo?.interviewData?.language?.slice(1) || "English"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StartInterview