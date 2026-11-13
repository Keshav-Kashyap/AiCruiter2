"use client";

import { Code2, Clock, Briefcase, Globe, Hourglass, Sparkles } from 'lucide-react';
import { formatTimer } from './interviewSessionHelpers';

const StartInterviewHeader = ({
    timer,
    remainingSeconds = 0,
    durationMinutes = 5,
    isCallActive = false,
    jobPosition,
    language,
    showCodeEditor,
    onToggleCodeEditor,
    onExtendDuration,
    onPreviewLoader
}) => {
    const isWarning = isCallActive && remainingSeconds <= 60 && remainingSeconds > 0;
    const isTimeUp = isCallActive && remainingSeconds <= 0;

    return (
        <div className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200'>
            <div className='px-4 sm:px-6 py-3'>
                <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3'>

                    {/* Left: Title & Info Badges */}
                    <div className='flex flex-wrap items-center gap-3'>
                        <div>
                            <h1 className='text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                <Sparkles className='w-5 h-5 text-indigo-500' />
                                AI Interview Session
                            </h1>
                        </div>

                        <div className='h-5 w-[1px] bg-gray-300 dark:bg-gray-700 hidden sm:block mx-1' />

                        {/* Badges for Job Role, Language, and Duration */}
                        <div className='flex flex-wrap items-center gap-2'>
                            {/* Job Role Badge */}
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 shadow-xs'>
                                <Briefcase className='w-3.5 h-3.5 text-indigo-500' />
                                {jobPosition || 'Software Engineer'}
                            </span>

                            {/* Language Badge */}
                            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-xs'>
                                <Globe className='w-3.5 h-3.5 text-emerald-500' />
                                {language || 'English'}
                            </span>


                        </div>
                    </div>

                    {/* Right: Timer Watch & Code Editor Toggle */}
                    <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
                        {/* Live Timer Watch Badge - Enabled & Visible from the Start */}
                        <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${isTimeUp
                                ? 'bg-red-600 text-white border-red-700 animate-pulse shadow-red-500/30 shadow-md'
                                : isWarning
                                    ? 'bg-amber-500 text-white border-amber-600 animate-pulse shadow-amber-500/30 shadow-md'
                                    : isCallActive
                                        ? 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800 shadow-xs'
                                        : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 shadow-xs'
                            }`}>
                            <Clock className={`h-4 w-4 ${isCallActive && !isTimeUp && !isWarning ? 'text-green-600 dark:text-green-400' : ''}`} />
                            <span>
                                {isTimeUp ? 'Time Up!' : `${formatTimer(remainingSeconds)} left`}
                            </span>
                        </div>

                        {/* Code Editor Toggle Button */}
                        <button
                            onClick={onToggleCodeEditor}
                            className='flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium shadow-sm'
                        >
                            <Code2 className='w-4 h-4' />
                            {showCodeEditor ? 'Hide' : 'Show'} Code Editor
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StartInterviewHeader;