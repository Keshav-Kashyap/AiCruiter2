"use client"

import { useUser } from '@/app/provider';
import { useParams } from 'next/navigation';
import React from 'react';
import InterviewDetailContainer from './_components/InterviewDetailContainer';
import CandidatList from './_components/CandidatList';
import InterviewDetailSkeleton from './_components/InterviewDetailSkeleton';
import { useInterviewDetail } from './_components/useInterviewDetail';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const InterviewDetails = () => {
    const interviewID = useParams();
    const interview_id = interviewID?.interview_id;
    const { user, loading: userLoading } = useUser();

    const { interviewDetail, loading } = useInterviewDetail(user, userLoading, interview_id);

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/60 dark:border-blue-800/60 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Interview Details
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Comprehensive overview, job parameters, and candidate feedback reports
                        </p>
                    </div>
                </div>
                <Link href="/scheduled-interview">
                    <Button variant="outline" className="gap-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </Button>
                </Link>
            </div>

            {loading ? (
                <InterviewDetailSkeleton />
            ) : (
                <>
                    <InterviewDetailContainer interviewDetail={interviewDetail} />
                    <CandidatList candidateList={interviewDetail?.['interview-feedback']} />
                </>
            )}
        </div>
    )
}

export default InterviewDetails