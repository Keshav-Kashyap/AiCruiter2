import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Calendar, Clock, Copy, List, Mail, Plus, Slack, MessageCircle, Check } from 'lucide-react';
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
        <div className='flex flex-col items-center w-full justify-center mt-10 space-y-6'>
            {/* Success Icon & Header */}
            <div className='flex flex-col items-center text-center'>
                <div className='bg-green-100 p-4 rounded-full mb-4'>
                    <Check className='w-12 h-12 text-green-600' />
                </div>
                <h2 className='font-bold text-2xl mb-2 text-gray-800'>
                    Your AI Interview is Ready!
                </h2>
                <p className='text-gray-600 max-w-md'>
                    Share this link with your candidate to start the interview process. The link will be active for 30 days.
                </p>
            </div>

            {/* Interview Link Card */}
            <div className='w-full p-6 rounded-xl bg-white shadow-lg border'>
                <div className='flex justify-between items-center mb-4 flex-wrap gap-2'>
                    <h3 className='font-semibold text-lg flex items-center gap-2'>
                        <Copy className='h-5 w-5 text-blue-600' />
                        Interview Link
                    </h3>
                    <span className='px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full'>
                        Valid for 30 Days
                    </span>
                </div>

                <div className='flex flex-col gap-3'>
                    <Input
                        defaultValue={GetInterviewUrl()}
                        disabled={true}
                        className='w-full bg-gray-50 text-sm'
                    />
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <Button
                            onClick={() => window.open(GetInterviewUrl(), '_blank')}
                            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 flex-1 justify-center'
                        >
                            <Calendar className='h-4 w-4' />
                            Join Interview
                        </Button>
                        <Button
                            onClick={() => onCopyLink()}
                            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 flex-1 justify-center'
                        >
                            <Copy className='h-4 w-4' />
                            Copy Link
                        </Button>
                    </div>
                </div>

                <hr className='my-5 border-gray-200' />

                {/* Interview Details */}
                <div className='flex gap-6 text-sm text-gray-600 flex-wrap'>
                    <div className='flex items-center gap-2'>
                        <Clock className='h-4 w-4 text-blue-500' />
                        <span>{formData?.duration || '30 min'}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <List className='h-4 w-4 text-green-500' />
                        <span>10 Questions</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4 text-purple-500' />
                        <span>AI Powered</span>
                    </div>
                </div>
            </div>

            {/* Share Options */}
            <div className='w-full p-6 rounded-xl bg-white shadow-lg border'>
                <h3 className='font-semibold text-lg mb-4 flex items-center gap-2'>
                    <Mail className='h-5 w-5 text-blue-600' />
                    Share Via
                </h3>
                <div className='flex gap-4 flex-wrap justify-center'>
                    <Button variant='outline' className='flex items-center gap-2 hover:bg-blue-50'>
                        <Mail className='h-4 w-4 text-blue-600' />
                        Email
                    </Button>
                    <Button variant='outline' className='flex items-center gap-2 hover:bg-purple-50'>
                        <Slack className='h-4 w-4 text-purple-600' />
                        Slack
                    </Button>
                    <Button variant='outline' className='flex items-center gap-2 hover:bg-green-50'>
                        <MessageCircle className='h-4 w-4 text-green-600' />
                        WhatsApp
                    </Button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className='flex w-full gap-4 flex-wrap justify-between'>
                <Link href='/dashboard'>
                    <Button variant='outline' className='flex items-center gap-2 hover:bg-gray-50'>
                        <ArrowLeft className='h-4 w-4' />
                        Back to Dashboard
                    </Button>
                </Link>
                <Link href='/dashboard/create-interview'>
                    <Button className='flex items-center gap-2 bg-green-600 hover:bg-green-700'>
                        <Plus className='h-4 w-4' />
                        Create New Interview
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewLink