import React from 'react';

export const UsernameSkeleton = () => (
    <span className='inline-block h-6 w-32 sm:h-7 sm:w-40 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse align-middle ml-1' />
);

export const AvatarSkeleton = ({ size = 'desktop' }) => (
    <div
        className={`relative ${
            size === 'mobile' ? 'w-12 h-12 border-2' : 'w-14 h-14 border-3'
        } bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse border-white dark:border-gray-800 shadow-lg`}
    />
);

const WelcomeContainerSkeleton = () => {
    return (
        <div className='bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='w-1 h-8 bg-blue-500 rounded-full' />
                    <UsernameSkeleton />
                </div>
                <AvatarSkeleton />
            </div>
        </div>
    );
};

export default WelcomeContainerSkeleton;