"use client"

import { useUser } from '@/app/provider'
import ThemeToggle from '@/components/ThemeToggle';
import Image from 'next/image';
import React from 'react'

const WelcomeContainer = () => {
    const { user } = useUser();

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

    return (
        <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl'>

            {/* Header Section */}
            <div className='flex justify-between items-start mb-6'>
                <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full'></div>
                        <div>
                            <h1 className='text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent'>
                                {getCurrentGreeting()}{user?.name ? `, ${user.name}` : ''}
                            </h1>
                            <p className='text-xs text-gray-500 dark:text-gray-400 font-medium mt-1'>
                                {getCurrentDate()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    {user?.picture && (
                        <div className='relative group'>
                            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300'></div>
                            <Image
                                src={user.picture}
                                alt="User Avatar"
                                width={56}
                                height={56}
                                className='relative rounded-full border-3 border-white dark:border-gray-800 shadow-lg hover:scale-105 transition-transform duration-200'
                            />
                            <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-3 border-white dark:border-gray-800 rounded-full shadow-sm'>
                                <div className='w-full h-full bg-emerald-400 rounded-full animate-pulse'></div>
                            </div>
                        </div>
                    )}

                    <div className='p-1 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-sm'>
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 dark:border-gray-600/30'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                            </svg>
                        </div>

                        <div>
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-1'>
                                AI Interview Platform
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed'>
                                Transform your hiring process with intelligent interviews
                                <br />
                                <span className='text-xs text-blue-600 dark:text-blue-400'>Streamlined • Professional • Efficient</span>
                            </p>
                        </div>
                    </div>

                    <div className='hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700'>
                        <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></div>
                        <span className='text-xs font-semibold text-emerald-700 dark:text-emerald-400'>
                            System Online
                        </span>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default WelcomeContainer