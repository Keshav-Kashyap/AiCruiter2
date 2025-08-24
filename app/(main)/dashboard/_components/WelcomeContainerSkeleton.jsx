import React from 'react';

const WelcomeContainerSkeleton = () => {
    return (
        <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'>

            {/* Mobile: Profile & Theme at top, Desktop: Normal layout */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-6'>

                {/* Mobile: Profile and Theme Toggle Row */}
                <div className='flex sm:hidden justify-between items-center mb-4'>
                    {/* Profile Picture Skeleton */}
                    <div className='relative'>
                        <div className='w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse'></div>
                        {/* Online Status Skeleton */}
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 rounded-full animate-pulse'></div>
                    </div>

                    {/* Theme Toggle Skeleton */}
                    <div className='p-1 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-sm'>
                        <div className='w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse'></div>
                    </div>
                </div>

                {/* Greeting Section Skeleton - Full width on mobile, flex-1 on desktop */}
                <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-1 h-6 sm:h-8 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-full animate-pulse'></div>
                        <div>
                            {/* Greeting Skeleton */}
                            <div className='h-6 w-40 sm:h-8 sm:w-48 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mb-2'></div>
                            {/* Date Skeleton */}
                            <div className='h-3 w-32 sm:h-4 sm:w-36 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
                        </div>
                    </div>
                </div>

                {/* Desktop: Profile and Theme Toggle */}
                <div className='hidden sm:flex items-center gap-4'>
                    {/* Profile Picture Skeleton */}
                    <div className='relative'>
                        <div className='w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse'></div>
                        {/* Online Status Skeleton */}
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-gray-300 dark:bg-gray-600 border-3 border-white dark:border-gray-800 rounded-full animate-pulse'></div>
                    </div>

                    {/* Theme Toggle Skeleton */}
                    <div className='p-1 rounded-xl bg-gray-100/70 dark:bg-gray-700/70 backdrop-blur-sm'>
                        <div className='w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse'></div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton - AI Interview Platform */}
            <div className='bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-200/30 dark:border-gray-600/30'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                    {/* Left Section - Icon and Text */}
                    <div className='flex items-start sm:items-center gap-3 sm:gap-4'>
                        {/* Icon Skeleton */}
                        <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 dark:bg-gray-600 rounded-xl animate-pulse flex-shrink-0 mt-1 sm:mt-0'></div>

                        <div className='flex-1 min-w-0'>
                            {/* Title Skeleton */}
                            <div className='h-5 w-36 sm:h-6 sm:w-44 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse mb-2'></div>
                            {/* Description Line 1 Skeleton */}
                            <div className='h-4 w-48 sm:w-60 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-1'></div>
                            {/* Description Line 2 Skeleton */}
                            <div className='h-3 w-32 sm:w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse'></div>
                        </div>
                    </div>

                    {/* Right Section - Status Badge Skeleton */}
                    <div className='flex sm:items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg animate-pulse self-start sm:self-auto'>
                        <div className='w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0'></div>
                        <div className='h-3 w-16 sm:w-20 bg-gray-300 dark:bg-gray-600 rounded-md'></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeContainerSkeleton;