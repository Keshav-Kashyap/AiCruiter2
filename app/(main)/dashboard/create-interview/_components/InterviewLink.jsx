import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus, Slack, MessageCircle, Check, ExternalLink, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { toast } from 'sonner';

const InterviewLink = (interview_id, formData) => {
    console.log("Your Interview Id", interview_id.interview_id);
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id.interview_id;


    const GetInterviewUrl = () => {
        return url;
    }

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    }

    return (
        <div className='flex flex-col items-center w-full justify-center mt-10 space-y-8 max-w-4xl mx-auto px-4'>
            {/* Success Icon & Header */}
            <div className='flex flex-col items-center text-center'>
                <div className='relative mb-6'>
                    <div className='absolute -inset-4 bg-green-100 dark:bg-green-900/20 rounded-full blur-xl opacity-50'></div>
                    <div className='relative bg-green-100 dark:bg-green-900/30 p-6 rounded-full border-4 border-green-200 dark:border-green-700'>
                        <Check className='w-16 h-16 text-green-600 dark:text-green-400' />
                    </div>
                </div>
                <h2 className='font-bold text-3xl mb-3 text-gray-900 dark:text-white'>
                    Your AI Interview is Ready!
                </h2>
                <p className='text-gray-600 dark:text-gray-300 max-w-lg text-lg leading-relaxed'>
                    Share this link with your candidate to start the interview process. The link will remain active for 30 days.
                </p>
            </div>

            {/* Interview Link Card */}
            <div className='w-full p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-200'>
                <div className='flex justify-between items-center mb-6 flex-wrap gap-3'>
                    <h3 className='font-bold text-xl flex items-center gap-3 text-gray-900 dark:text-white'>
                        <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center'>
                            <Copy className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                        </div>
                        Interview Link
                    </h3>
                    <div className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                        Valid for 30 Days
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600'>
                        <Input
                            defaultValue={GetInterviewUrl()}
                            disabled={true}
                            className='w-full bg-transparent border-none text-sm font-mono text-gray-700 dark:text-gray-300 focus:outline-none cursor-text'
                        />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <Button
                            onClick={() => window.open(GetInterviewUrl(), '_blank')}
                            className='flex items-center gap-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-6 transition-all duration-200 hover:scale-105 hover:shadow-lg group rounded-xl'
                        >
                            <ExternalLink className='h-5 w-5 group-hover:scale-110 transition-transform' />
                            Join Interview
                        </Button>
                        <Button
                            onClick={() => onCopyLink()}
                            className='flex items-center gap-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-6 transition-all duration-200 hover:scale-105 hover:shadow-lg group rounded-xl'
                        >
                            <Copy className='h-5 w-5 group-hover:scale-110 transition-transform' />
                            Copy Link
                        </Button>
                    </div>
                </div>

                <hr className='my-6 border-gray-200 dark:border-gray-600' />

                {/* Interview Details */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <div className='flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50'>
                        <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center'>
                            <Clock className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <div>
                            <p className='text-xs text-blue-700 dark:text-blue-300 font-medium'>Duration</p>
                            <p className='text-sm font-bold text-blue-800 dark:text-blue-200'>{formData?.duration || '30 min'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50'>
                        <div className='w-8 h-8 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center'>
                            <List className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div>
                            <p className='text-xs text-purple-700 dark:text-purple-300 font-medium'>Questions</p>
                            <p className='text-sm font-bold text-purple-800 dark:text-purple-200'>10 Questions</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/50'>
                        <div className='w-8 h-8 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg flex items-center justify-center'>
                            <Calendar className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                        </div>
                        <div>
                            <p className='text-xs text-emerald-700 dark:text-emerald-300 font-medium'>Type</p>
                            <p className='text-sm font-bold text-emerald-800 dark:text-emerald-200'>AI Powered</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Options */}
            <div className='w-full p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700'>
                <h3 className='font-bold text-xl mb-6 flex items-center gap-3 text-gray-900 dark:text-white'>
                    <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center'>
                        <Share2 className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    Share Interview Link
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                    <Button
                        variant='outline'
                        className='flex items-center justify-center gap-3 py-6 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-xl'
                    >
                        <Mail className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                        <span className='font-medium'>Email</span>
                    </Button>
                    <Button
                        variant='outline'
                        className='flex items-center justify-center gap-3 py-6 border-gray-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-xl'
                    >
                        <Slack className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                        <span className='font-medium'>Slack</span>
                    </Button>
                    <Button
                        variant='outline'
                        className='flex items-center justify-center gap-3 py-6 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 transition-all duration-200 rounded-xl'
                    >
                        <MessageCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                        <span className='font-medium'>WhatsApp</span>
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex w-full gap-6 flex-wrap justify-between items-center'>
                <Link href='/dashboard'>
                    <Button
                        variant='outline'
                        className='flex items-center gap-3 py-3 px-6 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:scale-105 rounded-xl'
                    >
                        <ArrowLeft className='h-5 w-5' />
                        Back to Dashboard
                    </Button>
                </Link>
                <Link href='/dashboard/create-interview'>
                    <Button
                        className='flex items-center gap-3 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-6 transition-all duration-200 hover:scale-105 hover:shadow-lg group rounded-xl'
                    >
                        <Plus className='h-5 w-5 group-hover:rotate-90 transition-transform duration-200' />
                        Create New Interview
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewLink