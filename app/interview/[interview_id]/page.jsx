"use client"

import React, { useContext, useEffect, useState } from 'react'
import InterviewHeader from '../_components/InterviewHeader'
import Image from 'next/image'
import { Clock, Info, Loader2, Video, User, Mail, CheckCircle, AlertCircle, Calendar, MapPin, Users, Building, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supaBaseClient'
import { InterviewDataContext } from '@/app/context/InterviewDataContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Loading from '@/components/Loading'

const Interview = () => {
    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState(null);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [formValid, setFormValid] = useState(false);
    const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
    const router = useRouter();

    useEffect(() => {
        interview_id && GetInterviewDetails();
    }, [interview_id])

    useEffect(() => {
        // Validate form
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail);
        const isValidName = userName.trim().length >= 2;
        setFormValid(isValidEmail && isValidName);
    }, [userName, userEmail])

    const GetInterviewDetails = async () => {
        setPageLoading(true);
        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition, jobDescription, duration, language, type, userEmail, created_at")
                .eq('interview_id', interview_id);

            if (error) {
                throw error;
            }

            if (interviews?.length === 0) {
                toast.error("Interview not found. Please check your interview link.");
                return;
            }

            setInterviewData({
                userName: userName,
                interviewData: interviews[0],
            });



        } catch (e) {
            console.error('Error fetching interview:', e);
            toast.error("Unable to load interview. Please check your connection and try again.");
        } finally {
            setPageLoading(false);
        }
    }

    const onJoinInterview = async () => {
        if (!formValid) {
            toast.error("Please fill in all required fields correctly.");
            return;
        }

        setLoading(true);
        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("*")
                .eq('interview_id', interview_id);

            if (error) throw error;

            setInterviewInfo({
                userName: userName.trim(),
                userEmail: userEmail.trim(),
                interviewData: interviews[0],
            });

            toast.success("Starting your interview...");
            router.push('/interview/' + interview_id + '/start');
        } catch (e) {
            console.error('Error joining interview:', e);
            toast.error("Failed to join interview. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const formatDuration = (duration) => {
        return duration ? `${duration}` : 'Not specified';
    }

    function capitalizeFirstLetter(str) {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    if (pageLoading) {
        return (
            <Loading loadingMessage={'Loading Interviews...'} loadingDescription={'Please wait while we prepare your interview...'} />
        );
    }


    console.log(interviewData);
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-8 pb-16'>
            <div className='max-w-2xl mx-auto'>
                {/* Header Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8'>
                    <div className='text-center space-y-6'>
                        {/* Logo and Branding */}
                        <div className="space-y-3">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">

                                <Image src='/logo2.png' alt="logo" width={200} height={200} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">QRA Interview Platform</h1>
                                <p className="text-gray-500 dark:text-gray-400">Next-generation interview experience</p>
                            </div>
                        </div>



                        {/* Interview Details */}
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2'>
                                    <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    {capitalizeFirstLetter(interviewData?.interviewData?.jobPosition) || 'Position Not Specified'}
                                </h2>
                                <div className='flex items-center justify-between gap-2 text-gray-600 dark:text-gray-300'>

                                    <div className='flex items-center gap-2 justify-center'>

                                        <Clock className='w-4 h-4' />
                                        <span>Duration: {formatDuration(interviewData?.interviewData?.duration)}</span>
                                    </div>

                                    <div className='flex gap-2 items-center justify-center'>

                                        <Globe className='w-4 h-4' />
                                        <span>Language: {capitalizeFirstLetter(interviewData?.interviewData?.language) || 'English'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 space-y-6'>
                    {/* Form Header */}
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Join Interview</h3>
                        <p className="text-gray-500 dark:text-gray-400">Please provide your details to continue</p>
                    </div>

                    {/* Form Fields */}
                    <div className='space-y-5'>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <User className="w-4 h-4" />
                                Full Name *
                            </label>
                            <Input
                                placeholder="Enter your full name (e.g., John Smith)"
                                value={userName}
                                onChange={(event) => setUserName(event.target.value)}
                                className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            {userName.length > 0 && userName.trim().length < 2 && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Name must be at least 2 characters
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Mail className="w-4 h-4" />
                                Email Address *
                            </label>
                            <Input
                                type="email"
                                placeholder="Enter your email (e.g., john@example.com)"
                                value={userEmail}
                                onChange={(event) => setUserEmail(event.target.value)}
                                className="h-12 text-base border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                            {userEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail) && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pre-Interview Checklist */}
                    <div className='p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                        <div className="flex items-start gap-3">
                            <Info className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
                            <div className="space-y-3">
                                <h4 className='font-semibold text-gray-900 dark:text-white'>Before You Begin</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Test your camera and microphone
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Ensure stable internet connection
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Find a quiet, well-lit space
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Close unnecessary applications
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Join Button */}
                    <Button
                        disabled={loading || !formValid}
                        className={`w-full h-14 text-lg font-semibold transition-all duration-200 ${formValid
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            : 'bg-gray-300 dark:bg-gray-600'
                            } ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={onJoinInterview}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className='w-5 h-5 animate-spin' />
                                <span>Starting Interview...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Video className="w-5 h-5" />
                                <span>Join Interview</span>
                            </div>
                        )}
                    </Button>

                    {/* Form Validation Message */}
                    {!formValid && (userName.length > 0 || userEmail.length > 0) && (
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Please complete all required fields to continue
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Having trouble? Make sure you have the correct interview link.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Interview