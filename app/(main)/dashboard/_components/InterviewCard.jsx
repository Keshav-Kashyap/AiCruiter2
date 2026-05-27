import { Button } from '@/components/ui/button';
import { getAvatarColor, getInitial } from '@/services/Constants';
import { ArrowRight, Copy, Calendar, Clock, Users, ExternalLink, Share2, Globe, Check } from 'lucide-react';
import moment from 'moment'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/provider';
import { toast } from 'sonner';
import { joinInterviewSession } from '@/services/interviewSession';

const InterviewCard = ({ interview, viewDetail = false }) => {
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview?.interview_id
    const router = useRouter();
    const { user } = useUser();
    const [copyLocked, setCopyLocked] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    console.log("Card in data", interview);

    useEffect(() => {
        if (!copyLocked) return;

        const timer = setTimeout(() => {
            setCopyLocked(false);
            setCopySuccess(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [copyLocked]);

    const CopyLink = () => {
        if (copyLocked) return;

        navigator.clipboard.writeText(url);
        setCopyLocked(true);
        setCopySuccess(true);
        toast.success("Link Copied Successfully");
    }

    const onSend = () => {
        window.location.href = "mailto:talkwithgamers?subject=AICruiter Interview Link&body=Interview Link: " + url
    }

    const handleJoinInterview = async () => {
        try {
            await joinInterviewSession({
                interviewId: interview?.interview_id,
                userName: user?.name || user?.full_name || user?.email,
                userEmail: user?.email,
                router,
            });
            toast.success('Starting interview...');
        } catch (error) {
            console.error('Error starting interview from card:', error);
            toast.error(error?.message || 'Failed to start interview.');
        }
    }


    return (
        <div className='group p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm'>

            {/* Header Section */}
            <div className='flex items-center justify-between mb-4'>
                <div className="relative">
                    {/* Enhanced Avatar with Gradient Border */}
                    <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300'></div>
                    <div
                        className="relative h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white dark:border-gray-800 group-hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: getAvatarColor(`${interview?.jobPosition}`) }}
                    >
                        {getInitial(`${interview?.jobPosition}`)}



                    </div>

                    {/* Status Indicator */}
                    <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm'>
                        <div className='w-full h-full bg-emerald-400 rounded-full animate-pulse'></div>
                    </div>
                </div>

                {/* Date Badge */}
                <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600'>
                    <Calendar className='w-4 h-4 text-gray-600 dark:text-gray-400' />
                    <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        {moment(interview?.created_at).format('DD MMM YYYY')}
                    </span>
                </div>
            </div>

            {/* Job Position Title */}
            <div className='mb-4'>

                <div class='flex justify-between items-center mb-4'>

                <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
                    {interview?.jobPosition?.charAt(0).toUpperCase() + interview?.jobPosition?.slice(1)}
                </h2>
              


                 <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600'>
    
                    <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                       
                       
                        {interview?.CompanyName||"Company"}



                    </span>
                </div>
                  </div>




                {/* Interview Details */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300'>

                        <div className='flex gap-2 items-center justify-center'>
                            <Clock className='w-4 h-4' />
                            <span className='text-sm font-medium'>{interview?.duration}</span>
                        </div>

                        <div className='flex gap-2 items-center justify-center'>
                            <Globe className='w-4 h-4' />
                            <span className='text-sm font-medium'>{interview?.language?.charAt(0).toUpperCase() + interview?.language?.slice(1) || 'English'}</span>
                        </div>


                    </div>

                    {viewDetail && (
                        <div className='flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700'>
                            <Users className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                {interview['interview-feedback']?.length} Candidates
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Interview Stats */}
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 mb-5 border border-gray-200/30 dark:border-gray-600/30'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='text-center'>
                        <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>AI</div>
                        <div className='text-xs text-gray-600 dark:text-gray-400 font-medium'>Powered</div>
                    </div>
                    <div className='text-center'>
                        <div className='text-lg font-bold text-purple-600 dark:text-purple-400'>Live</div>
                        <div className='text-xs text-gray-600 dark:text-gray-400 font-medium'>Status</div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            {!viewDetail ? (
                <div className='flex gap-3 w-full items-stretch'>
                    <Button
                        onClick={handleJoinInterview}
                        className='flex-1 h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none shadow-lg hover:shadow-xl transition-all duration-200 group/btn'
                    >
                        <ExternalLink className='w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                        Join
                    </Button>

                    <Button
                        onClick={() => CopyLink()}
                        disabled={copyLocked}
                        variant="outline"
                        className='flex-1 h-11 group/btn border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed'
                    >
                        {copySuccess ? (
                            <Check className='w-4 h-4 mr-2 text-green-600 dark:text-green-400' />
                        ) : (
                            <Copy className='w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                        )}
                        {copyLocked ? 'Copied' : 'Copy Link'}
                    </Button>

                    <Button
                        onClick={() => onSend()}
                        variant="outline"
                        className='h-11 w-11 shrink-0 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 group/btn flex items-center justify-center p-0'
                        title='Share interview link'
                    >
                        <Share2 className='w-4 h-4 text-purple-600 dark:text-purple-400 group-hover/btn:scale-110 transition-transform duration-200' />
                    </Button>
                </div>
            ) : (
                <Link href={'/scheduled-interview/' + interview?.interview_id + "/details"}>
                    <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none shadow-lg hover:shadow-xl transition-all duration-200 group/btn"
                        variant="default"
                    >
                        <ExternalLink className='w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200' />
                        View Details
                        <ArrowRight className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200' />
                    </Button>
                </Link>
            )}

            {/* Bottom Accent Line */}
            <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </div>
    )
}

export default InterviewCard