"use client"

import { useUser } from '@/app/provider'
import ThemeToggle from '@/components/ThemeToggle';
// Import skeleton
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit, User, X, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import WelcomeContainerSkeleton from './WelcomeContainerSkeleton';

const WelcomeContainer = () => {
    const { user, loading } = useUser(); // Assuming useUser returns loading state
    const router = useRouter();
    const [showEmailPopup, setShowEmailPopup] = useState(false);

    // Check if user has email and show popup
    useEffect(() => {
        if (user && !user.email) {
            const hasShownPopup = localStorage.getItem('email-popup-shown');
            if (!hasShownPopup) {
                setShowEmailPopup(true);
                localStorage.setItem('email-popup-shown', 'true');
            }
        }
    }, [user]);

      useEffect(() => {
    router.prefetch("/settings");

  }, [router]);

    // Show skeleton while loading
    if (loading || !user) {
        return <WelcomeContainerSkeleton />;
    }

    const getCurrentGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleProfileClick = () => {
        router.push('/settings');
    };

    const handleCompleteProfile = () => {
        setShowEmailPopup(false);
        router.push('/settings');
    };

    const handleClosePopup = () => {
        setShowEmailPopup(false);
    };

    return (
        <>
            <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>

                {/* Mobile: Profile & Theme at top, Desktop: Normal layout */}
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-6'>

                    {/* Mobile: Profile and Theme Toggle Row */}
                    <div className='flex sm:hidden justify-between items-center mb-4'>
                        {/* Profile Picture or Default Icon with Edit */}
                        <div className='relative group cursor-pointer' onClick={handleProfileClick}>
                            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300'></div>

                            {user?.picture ? (
                                <Image
                                    src={user.picture}
                                    alt="User Avatar"
                                    width={48}
                                    height={48}
                                    className='relative rounded-full border-3 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform duration-200'
                                />
                            ) : (
                                <div className='relative w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center border-3 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform duration-200'>
                                    <User className='w-6 h-6 text-gray-600 dark:text-gray-300' />
                                </div>
                            )}

                            {/* Online Status Indicator */}
                            <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm'>
                                <div className='w-full h-full bg-emerald-400 rounded-full animate-pulse'></div>
                            </div>

                            {/* Edit Icon on Hover */}
                            <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                <Edit className='w-3 h-3 text-white' />
                            </div>
                        </div>

                        <div className='p-1 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-sm'>
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Greeting Section - Full width on mobile, flex-1 on desktop */}
                    <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full'></div>
                            <div>
                                <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                                    {getCurrentGreeting()}{user?.name ? `, ${user.name}` : ''}
                                </h1>
                                <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mt-1'>
                                    {getCurrentDate()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: Profile and Theme Toggle */}
                    <div className='hidden sm:flex items-center gap-4'>
                        {/* Profile Picture or Default Icon with Edit */}
                        <div className='relative group cursor-pointer' onClick={handleProfileClick}>
                            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300'></div>

                            {user?.picture ? (
                                <Image
                                    src={user.picture}
                                    alt="User Avatar"
                                    width={56}
                                    height={56}
                                    className='relative rounded-full border-3 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform duration-200'
                                />
                            ) : (
                                <div className='relative w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center border-3 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform duration-200'>
                                    <User className='w-7 h-7 text-gray-600 dark:text-gray-300' />
                                </div>
                            )}

                            {/* Online Status Indicator */}
                            <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-3 border-white dark:border-gray-800 rounded-full shadow-sm'>
                                <div className='w-full h-full bg-emerald-400 rounded-full animate-pulse'></div>
                            </div>

                            {/* Edit Icon on Hover */}
                            <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                <Edit className='w-4 h-4 text-white' />
                            </div>
                        </div>

                        <div className='p-1 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-sm'>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Main Content - AI Interview Platform */}
                <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/30 dark:border-gray-600/30'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                        {/* Left Section - Icon and Text */}
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">

                            <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 mt-1 sm:mt-0'>
                                <svg className='w-5 h-5 sm:w-6 sm:h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                                </svg>
                            </div>

                            <div className='flex-1 min-w-0'>
                                <h3 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1'>
                                    AI Interview Platform
                                </h3>
                                <p className='text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed'>
                                    Transform your hiring process with intelligent interviews
                                </p>
                                <span className='text-xs text-blue-600 dark:text-blue-400 block mt-1'>
                                    Streamlined • Professional • Efficient
                                </span>
                            </div>
                        </div>

                        {/* Right Section - Status Badge */}
                        <div className='flex sm:items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700 self-start sm:self-auto'>
                            <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0'></div>
                            <span className='text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap'>
                                System Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Popup Modal */}
            {showEmailPopup && (
                <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 transform transition-all duration-300 scale-100'>
                        {/* Header */}
                        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center'>
                                    <AlertTriangle className='w-5 h-5 text-amber-600 dark:text-amber-400' />
                                </div>
                                <div>
                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                        Complete Your Profile
                                    </h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                                        Almost there!
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClosePopup}
                                className='p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
                            >
                                <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                            </button>
                        </div>

                        {/* Content */}
                        <div className='p-6'>
                            <div className='mb-6'>
                                <p className='text-gray-700 dark:text-gray-300 mb-4'>
                                    We noticed your profile is missing some important information. Adding your email address will help us:
                                </p>
                                <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                                    <li className='flex items-center gap-2'>
                                        <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                                        Send interview notifications
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                                        Provide account security
                                    </li>
                                    <li className='flex items-center gap-2'>
                                        <div className='w-1.5 h-1.5 bg-blue-500 rounded-full'></div>
                                        Share interview results
                                    </li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className='flex gap-3'>
                                <button
                                    onClick={handleCompleteProfile}
                                    className='flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg'
                                >
                                    Complete Profile
                                </button>
                                <button
                                    onClick={handleClosePopup}
                                    className='px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors duration-200'
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default WelcomeContainer