"use client"

import { useUser } from '@/app/provider'
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Edit, User } from 'lucide-react';
import React, { useState, useEffect } from 'react'

const WelcomeContainer = () => {
    const { user, loading } = useUser();
    const router = useRouter();
    const [cachedName, setCachedName] = useState(null);

    useEffect(() => {
        router.prefetch("/settings");
        if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                setCachedName(storedName);
            }
        }
    }, [router]);

    const displayName = user?.name || cachedName;

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

    return (
        <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>

            {/* Mobile: Profile & Theme at top, Desktop: Normal layout */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0'>

                {/* Mobile: Profile and Theme Toggle Row */}
                <div className='flex sm:hidden justify-between items-center mb-4'>
                    {/* Profile Picture or Default Icon with Edit */}
                    <div className='relative group cursor-pointer' onClick={handleProfileClick}>
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300'></div>

                        {loading && !user?.picture ? (
                            <div className='relative w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse border-2 border-white dark:border-gray-800 shadow-lg' />
                        ) : user?.picture ? (
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
                        {!loading && (
                            <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                <Edit className='w-3 h-3 text-white' />
                            </div>
                        )}
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
                            <h1 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center flex-wrap gap-1.5'>
                                <span>{getCurrentGreeting()}</span>
                                {displayName ? (
                                    <span>, {displayName}</span>
                                ) : loading ? (
                                    <span className='inline-block h-6 w-32 sm:h-7 sm:w-40 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse align-middle ml-1'></span>
                                ) : null}
                            </h1>
                            <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mt-1'>
                                {getCurrentDate()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desktop Profile & Theme Toggle */}
                <div className='hidden sm:flex items-center gap-4'>
                    {/* Profile Picture or Default Icon with Edit */}
                    <div className='relative group cursor-pointer' onClick={handleProfileClick}>
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300'></div>

                        {loading && !user?.picture ? (
                            <div className='relative w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse border-3 border-white dark:border-gray-800 shadow-lg' />
                        ) : user?.picture ? (
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
                        {!loading && (
                            <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200'>
                                <Edit className='w-4 h-4 text-white' />
                            </div>
                        )}
                    </div>

                    <div className='p-1 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-sm'>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WelcomeContainer