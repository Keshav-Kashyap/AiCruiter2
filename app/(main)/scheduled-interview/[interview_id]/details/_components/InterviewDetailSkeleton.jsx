import React from 'react';

export const InterviewContainerSkeleton = () => {
    return (
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-6 mt-5 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-7 w-48 bg-gray-300 dark:bg-gray-700 rounded-md" />
                </div>
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Description Skeleton */}
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
                <div className="space-y-2 pl-4 border-l-4 border-gray-300 dark:border-gray-700">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
            </div>

            {/* Questions Section Skeleton */}
            <div className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full ml-auto" />
                </div>

                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-600 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CandidateListSkeleton = () => {
    return (
        <div className="mt-8 space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-9 h-9 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                <div className="h-6 w-36 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>

            {/* Candidate Cards Skeleton */}
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
                                <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                            <div className="h-9 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InterviewDetailSkeleton = () => {
    return (
        <div className="space-y-6">
            <InterviewContainerSkeleton />
            <CandidateListSkeleton />
        </div>
    );
};

export default InterviewDetailSkeleton;
