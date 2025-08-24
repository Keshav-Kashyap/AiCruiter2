"use client"

import { Video, Plus } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';

const MobileNavigation = () => {
    return (
        <div className='w-full p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between rounded-2xl mb-6 shadow-lg transition-all duration-300'>

            {/* Sidebar Trigger */}

            <div className='flex gap-5 items-center justify-center'>
                <div className='flex items-center'>
                    <div className='p-2 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 backdrop-blur-sm'>
                        <SidebarTrigger className='text-gray-700 dark:text-gray-300' />
                    </div>
                </div>

                {/* Logo */}
                <div className='flex items-center'>
                    <div className='relative'>
                        {/* Glow effect behind logo */}
                        <div className='absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-400/30 dark:to-purple-400/30 rounded-xl blur-lg opacity-60'></div>
                        <div className='relative bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm'>
                            <Image
                                src='/logo2.png'
                                alt='logo'
                                width={100}
                                height={100}
                                className='transition-transform w-10 duration-200 hover:scale-105'
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* Create Interview Button */}
            <div className='flex items-center'>
                <Link href="dashboard/create-interview">
                    <div className='relative group'>
                        {/* Button glow effect */}
                        <div className='absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300'></div>

                        <div className='relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-3 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all duration-200'>
                            <Video className='w-5 h-5 text-white' />
                        </div>

                        {/* Floating Plus Icon */}
                        <div className='absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-md'>
                            <Plus className='w-3 h-3 text-white' />
                        </div>

                        {/* Tooltip */}
                        <div className='absolute -bottom-12 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg'>
                            Create Interview
                            {/* Tooltip arrow */}
                            <div className='absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45'></div>
                        </div>
                    </div>
                </Link>
            </div>

        </div>
    )
}

export default MobileNavigation