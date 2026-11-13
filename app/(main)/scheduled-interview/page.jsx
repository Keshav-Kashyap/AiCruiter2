"use client"
import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { Video, Calendar, Users, Plus, Loader2, RefreshCw, FileText, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard'
import InterviewListSkeleton from '../dashboard/_components/InterviewListSkeleton'
import { useInterview } from '../dashboard/_components/useInterview'
import Link from 'next/link'

function ScheduledInterview() {
    const { user, loading: userLoading } = useUser();
    const [limit, setLimit] = useState(10);

    const { interviewList = [], loading, isFetching, refetch } = useInterview(user, userLoading, limit);

    // Infinite Scroll handler - Load 10 more on scroll near bottom
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                if (!isFetching && interviewList.length >= limit) {
                    setLimit(prev => prev + 10);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFetching, interviewList.length, limit]);

    const handleRefresh = async () => {
        await refetch();
    };

    const getStats = () => {
        const totalInterviews = interviewList?.length || 0;
        const interviewsWithFeedback = interviewList?.filter(interview =>
            interview['interview-feedback'] && interview['interview-feedback'].length > 0
        ).length || 0;

        return { totalInterviews, interviewsWithFeedback };
    };

    const { totalInterviews, interviewsWithFeedback } = getStats();

    return (
        <div className=" space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Interview Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Manage and monitor your scheduled interviews
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                        {isFetching ? 'Refreshing...' : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {!loading && interviewList?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Interviews</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalInterviews}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">With Feedback</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{interviewsWithFeedback}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {totalInterviews > 0 ? Math.round((interviewsWithFeedback / totalInterviews) * 100) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="space-y-4">
                {loading ? (
                    <InterviewListSkeleton limit={6} />
                ) : (
                    <>
                        {interviewList?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                                    <Video className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Interviews Created Yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                                    Get started by creating your first interview. Set up questions, configure settings, and start interviewing candidates.
                                </p>
                                <Link href="/dashboard/create-interview">
                                    <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create New Interview
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Your Interviews ({interviewList.length})
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {interviewList.map((interview, index) => (
                                        <div key={index} className="group hover:scale-[1.02] transition-transform duration-200">
                                            <InterviewCard
                                                interview={interview}
                                                viewDetail={true}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Incremental Scroll Loading Indicator */}
                                {isFetching && interviewList.length > 0 && (
                                    <div className="flex justify-center items-center py-6 gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                                        <span>Loading more interviews...</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ScheduledInterview;