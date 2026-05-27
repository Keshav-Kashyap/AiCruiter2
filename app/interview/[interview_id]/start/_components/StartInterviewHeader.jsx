"use client";

import { Code2, Timer } from 'lucide-react';

const StartInterviewHeader = ({ timer, jobPosition, language, duration, showCodeEditor, onToggleCodeEditor }) => {
    return (
        <div className='bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700'>
            <div className='px-6 py-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-xl lg:text-2xl font-bold text-gray-900 dark:text-white'>
                                AI Interview Session
                            </h1>
                            <div className='flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg'>
                                <Timer className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                                <span className='text-sm font-mono font-semibold text-gray-900 dark:text-white'>
                                    {timer}
                                </span>
                            </div>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                            {jobPosition || 'Interview'} • {language || 'English'} • {duration || '30 min'}
                        </p>
                    </div>

                    <button
                        onClick={onToggleCodeEditor}
                        className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium'
                    >
                        <Code2 className='w-4 h-4' />
                        {showCodeEditor ? 'Hide' : 'Show'} Code Editor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartInterviewHeader;