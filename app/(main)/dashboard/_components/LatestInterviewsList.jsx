"use client"
import { useUser } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supaBaseClient'
import { Video, Plus, Loader2, Clock, TrendingUp, ChevronRight, FileText, Calendar, Eye, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const LatestInterviewsList = () => {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        user && GetInterViewList();
    }, [user])

    const GetInterViewList = async () => {
        setLoading(true);

        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('userEmail', user?.email)
                .order('id', { ascending: false })
                .limit(6)

            if (error) {
                toast.error('Failed to fetch latest interviews');
                console.error('Error:', error);
                return;
            }

            console.log(interviews);
            setInterviewList(interviews || []);
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Something went wrong while fetching interviews');
        } finally {
            setLoading(false);
        }
    }

    const onCreateInterview = () => {
        router.push('/dashboard/create-interview')
    }


    const getRecentStats = () => {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentCount = interviewList.filter(interview => {
            const created = new Date(interview.created_at);
            return created >= lastWeek;
        }).length;

        return { recentCount, totalShown: interviewList.length };
    }

    const { recentCount, totalShown } = getRecentStats();

    return (
        <div className='my-8 space-y-6'>
            {/* Header Section */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Recent Interviews
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Your latest Created interviews
                        </p>
                    </div>
                </div>

                {!loading && interviewList.length > 0 && (
                    <Link href="/all-interview">
                        <Button variant="outline" className="hover:bg-green-50 dark:hover:bg-green-900/20 group">
                            View All
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                )}
            </div>

            {/* Quick Stats */}
            {!loading && interviewList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Recent Interviews</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalShown}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">This Week</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{recentCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Status</p>
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">All Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                            <Loader2 className="w-8 h-8 text-green-600 dark:text-green-400 animate-spin" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Loading Recent Interviews
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            Fetching your latest interview data...
                        </p>
                    </div>
                ) : (
                    <>
                        {interviewList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                                    <Video className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No Interviews Created Yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                                    Get started by creating your first interview. Design questions, set parameters, and begin your hiring process.
                                </p>

                                <Button

                                    onClick={() => onCreateInterview()}

                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border-0">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Your First Interview
                                </Button>

                                {/* Getting Started Guide */}
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Quick Setup</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Create interviews in minutes</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Track Progress</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Monitor candidate responses</p>
                                    </div>
                                    <div className="text-center p-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Get Insights</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">AI-powered feedback</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Latest Interviews
                                    </h3>
                                    {interviewList.length === 6 && (
                                        <Link href="/dashboard/interviews">
                                            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                                See All Interviews
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {interviewList.map((interview, index) => (
                                        <div
                                            key={index}
                                            className="group hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
                                        >
                                            <InterviewCard interview={interview} />
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Section */}
                                {interviewList.length === 6 && (
                                    <div className="flex justify-center pt-6">
                                        <Link href="/all-interview">
                                            <Button
                                                variant="outline"
                                                className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 px-8 py-3 font-medium"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View All {totalShown}+ Interviews
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default LatestInterviewsList