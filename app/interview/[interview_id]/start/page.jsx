"use client"

import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { Loader2Icon, Mic, Phone, Timer, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import Vapi from '@vapi-ai/web';
import { toast } from 'sonner';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supaBaseClient';

const startInterview = () => {
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    const [activeUser, setActiveUser] = useState(false);
    const [conversation, setConversation] = useState();
    const { interview_id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [timer, setTimer] = useState(0);
    const [volume, setVolume] = useState(0.8); // Volume from 0 to 1
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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

    // Don't auto-start call, let user manually start
    // useEffect(() => {
    //     interviewInfo && startCall();
    // }, [interviewInfo])

    useEffect(() => {
        const handleMessage = (message) => {
            console.log('Message', message);
            if (message?.conversation) {
                const convoString = JSON.stringify(message.conversation);
                console.log('Conversation string', convoString);
                setConversation(convoString);
            }
        }
        vapi.on('message', handleMessage);

        vapi.on('call-start', () => {
            console.log('Call started')
            setIsCallActive(true);
            setTimer(0); // Reset timer
            toast.success('Interview Started Successfully!');
        });

        vapi.on('speech-start', () => {
            console.log('AI started speaking')
            setActiveUser(false);
        });

        vapi.on('speech-end', () => {
            console.log('AI finished speaking');
            setActiveUser(true);
        });

        vapi.on('call-end', () => {
            console.log('Call ended')
            setIsCallActive(false);
            setActiveUser(false);
            toast.success('Interview Completed');
        });

        // Handle volume changes
        vapi.on('volume-change', (volumeLevel) => {
            setVolume(volumeLevel);
        });

        return () => {
            vapi.off("message", handleMessage);
            vapi.off("call-start", () => console.log("END"));
            vapi.off("call-end", () => console.log("END"));
            vapi.off("speech-start", () => console.log("END"));
            vapi.off("speech-end", () => console.log("END"));
        }
    })


    // helper function for Deepgram
    function getDeepgramLangCode(lang) {
        if (!lang) return "en-US"; // default
        switch (lang.toLowerCase()) {
            case "english":
                return "en-US";
            case "hindi":
                return "hi-IN";  // deepgram Hindi support code
            default:
                return "en-US";
        }
    }

    // helper function for PlayHT (voice selection)
    function getPlayhtVoice(lang) {
        if (!lang) return "jennifer"; // default english voice
        switch (lang.toLowerCase()) {
            case "english":
                return "jennifer";  // or any english voiceId
            case "hindi":
                return "ananya";   // PlayHT hindi female voice (example)
            default:
                return "jennifer";
        }
    }

    const startCall = () => {
        if (!interviewInfo) {
            toast.error('Interview information not loaded');
            return;
        }

        let questionList = "";
        interviewInfo?.interviewData?.questionList.forEach((item, index) => {
            questionList += item?.question + ", ";
        });
        console.log('Starting call with questions:', questionList);

        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview for the " + interviewInfo?.interviewData?.jobPosition + " position?",
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: getDeepgramLangCode(interviewInfo?.interviewData?.language),
            },
            voice: {
                provider: "playht",
                voiceId: getPlayhtVoice(interviewInfo?.interviewData?.language),
            },
            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate's confidence level
✅ Ensure the interview remains focused on the topic
`.trim(),
                    },
                ],
            },
        };

        try {
            vapi.start(assistantOptions);
            console.log('Vapi.start() called successfully');
        } catch (error) {
            console.error('Error starting call:', error);
            toast.error('Failed to start interview');
        }
    }

    const toggleMute = () => {
        if (!isCallActive) return;

        try {
            if (isMuted) {
                vapi.setMuted(false);
            } else {
                vapi.setMuted(true);
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
            // Set volume (0.0 to 1.0)
            if (vapi.setVolume) {
                vapi.setVolume(newVolume);
            }
            // Alternative: adjust audio element volume if available
            const audioElements = document.querySelectorAll('audio');
            audioElements.forEach(audio => {
                audio.volume = newVolume;
            });
        } catch (error) {
            console.error('Error setting volume:', error);
        }
    };

    const stopInterview = () => {
        vapi.stop();
        GenrateFeedBack();
    }

    const GenrateFeedBack = async () => {
        setLoading(true);

        try {
            const result = await axios.post('/api/ai-feedback', {
                conversation: conversation
            });

            console.log(result?.data);

            // Extract only JSON part
            const Content = result?.data.content;
            const jsonMatch = Content.match(/```json([\s\S]*?)```/);
            const rawJSON = jsonMatch ? jsonMatch[1].trim() : Content;

            let feedbackParsed;
            try {
                feedbackParsed = JSON.parse(rawJSON);
            } catch (err) {
                console.error("Failed to parse feedback JSON:", err);
                toast.error("Failed to generate feedback");
                setLoading(false);
                return;
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
                                    AI Recruiter
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
                        {/* Start Interview Button (only show if call not active) */}
                        {!isCallActive && !loading && (
                            <button
                                onClick={startCall}
                                className='group relative h-16 w-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl shadow-green-500/40'
                            >
                                <Phone className='h-7 w-7' />
                                <span className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap'>
                                    Start Interview
                                </span>
                            </button>
                        )}

                        {/* Mute Button (only show if call is active) */}
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

                        {/* End Call Button (only show if call is active) */}
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

                                {/* Volume Slider */}
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
                        ) : isCallActive ? (
                            <p className='text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                                Interview in Progress
                            </p>
                        ) : (
                            <div className='space-y-2'>
                                <p className='text-gray-900 dark:text-white font-medium'>
                                    Ready to Start Interview
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
                            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 max-w-md mx-auto'>
                                <p className='text-xs text-blue-700 dark:text-blue-300'>
                                    <strong>Tip:</strong> Speak clearly and take your time to think before answering
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='space-y-2'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Your interview is being recorded and will be automatically analyzed
                            </p>
                            <p className='text-xs text-gray-400 dark:text-gray-500'>
                                Use the mute button if you need a moment to think
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default startInterview