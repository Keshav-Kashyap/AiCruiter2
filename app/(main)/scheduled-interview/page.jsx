"use client"
import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supaBaseClient'
import { Video, Calendar, Users, Plus, Loader2, RefreshCw, ChevronRight, FileText, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard'

function ScheduledInterview() {
    const user = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        user && GetInterviewList();
    }, [user])

    const GetInterviewList = async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const result = await supabase.from('interviews')
                .select('jobPosition,duration,interview_id,interview-feedback(userEmail)')
                .eq('userEmail', user?.user?.email)
                .order('id', { ascending: false })

            console.log(result);
            setInterviewList(result.data || []);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            setInterviewList([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }

    const handleRefresh = () => {
        GetInterviewList(true);
    }

    const getStats = () => {
        const totalInterviews = interviewList?.length || 0;
        const interviewsWithFeedback = interviewList?.filter(interview =>
            interview['interview-feedback'] && interview['interview-feedback'].length > 0
        ).length || 0;

        return { totalInterviews, interviewsWithFeedback };
    }

    const { totalInterviews, interviewsWithFeedback } = getStats();

    return (
        <div className="mt-8 space-y-6">
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
                        disabled={refreshing}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? 'Refreshing...' : 'Refresh'}
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
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading Interviews
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            Please wait while we fetch your interview data...
                        </p>
                    </div>
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
                                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create New Interview
                                </Button>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Create Interview</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Set up questions and job details</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Invite Candidates</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Share interview links</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Review Results</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Analyze candidate feedback</p>
                                    </div>
                                </div>
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
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ScheduledInterview