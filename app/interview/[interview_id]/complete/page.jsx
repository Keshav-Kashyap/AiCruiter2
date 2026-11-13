"use client";
import React, { useState } from 'react';
import { CheckCircle, Home, Loader2, FileText } from "lucide-react";
import { useRouter, useParams } from 'next/navigation';


const InterviewComplete = () => {
    const [loadingHome, setLoadingHome] = useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const router = useRouter();
    const params = useParams();
    const interview_id = params?.interview_id;

    const handleGoHome = () => {
        setLoadingHome(true);
        // Simulate navigation delay
        setTimeout(() => {
            setLoadingHome(false);
            router.push('/dashboard');
        }, 800);
    };

    const handleCheckFeedback = () => {
        setLoadingFeedback(true);
        setTimeout(() => {
            setLoadingFeedback(false);
            if (interview_id) {
                router.push(`/scheduled-interview/${interview_id}/details`);
            } else {
                router.push('/scheduled-interview');
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-2xl p-8 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500 dark:text-green-400 mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Interview Completed!
                </h1>

                {/* Message */}
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Thank you for completing the interview. Your responses have been recorded successfully.
                    We will review your application and get back to you soon.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={handleCheckFeedback}
                        disabled={loadingFeedback || loadingHome}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        {loadingFeedback ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <FileText className="w-5 h-5" />
                        )}
                        {loadingFeedback ? 'Loading...' : 'Check Feedback'}
                    </button>

                    <button
                        onClick={handleGoHome}
                        disabled={loadingHome || loadingFeedback}
                        className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        {loadingHome ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Home className="w-5 h-5" />
                        )}
                        {loadingHome ? 'Loading...' : 'Go Home'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewComplete;