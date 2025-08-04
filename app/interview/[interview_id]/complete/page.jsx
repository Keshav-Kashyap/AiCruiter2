"use client";


import React, { useState } from 'react'
import { CheckCircle, Home, Loader2Icon } from "lucide-react";
import { useRouter } from 'next/navigation';

const InterviewComplete = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleGoHome = () => {
        setLoading(true);
        setTimeout(() => {
            router.push('/dashboard');
        }, 300);

    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Interview Completed!
                </h1>

                {/* Message */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Thank you for completing the interview. Your responses have been recorded successfully.
                    We will review your application and get back to you soon.
                </p>

                {/* Go Home Button */}
                <button
                    onClick={() => handleGoHome()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
                >

                    {loading ? <Loader2Icon className='animate-spin' /> : <Home className="w-5 h-5" />}
                    Go Home
                </button>
            </div>
        </div>
    );
}

export default InterviewComplete