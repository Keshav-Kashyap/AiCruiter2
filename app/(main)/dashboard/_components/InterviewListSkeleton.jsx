import React from 'react';

export const InterviewCardSkeleton = () => {
    return (
        <div className='p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl animate-pulse space-y-4 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
                <div className='w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full' />
                <div className='h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-xl' />
            </div>
            <div className='space-y-3'>
                <div className='flex justify-between items-center gap-2'>
                    <div className='h-6 w-36 bg-gray-300 dark:bg-gray-700 rounded-md' />
                    <div className='h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl' />
                </div>
                <div className='flex items-center gap-4'>
                    <div className='h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded' />
                    <div className='h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded' />
                </div>
            </div>
            <div className='bg-gray-100 dark:bg-gray-700/40 rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='flex flex-col items-center space-y-1.5'>
                        <div className='h-5 w-8 bg-gray-300 dark:bg-gray-600 rounded' />
                        <div className='h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded' />
                    </div>
                    <div className='flex flex-col items-center space-y-1.5'>
                        <div className='h-5 w-10 bg-gray-300 dark:bg-gray-600 rounded' />
                        <div className='h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded' />
                    </div>
                </div>
            </div>
            <div className='flex gap-3 pt-2'>
                <div className='h-11 flex-1 bg-gray-300 dark:bg-gray-700 rounded-xl' />
                <div className='h-11 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl' />
                <div className='h-11 w-11 bg-gray-200 dark:bg-gray-700 rounded-xl' />
            </div>
        </div>
    );
};

export const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
            </div>
        ))}
    </div>
);

const InterviewListSkeleton = ({ limit = 6, showStats = false }) => {
    return (
        <div className="space-y-4">
            {showStats && <StatsSkeleton />}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: limit }).map((_, index) => (
                    <InterviewCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export default InterviewListSkeleton;
