"use client";

import { Loader2, Mic, Phone, Volume2, VolumeX, Plus } from 'lucide-react';

const InterviewControls = ({
    isCallActive,
    loading,
    callStarting,
    isMuted,
    showVolumeSlider,
    volume,
    onStart,
    onToggleMute,
    onEnd,
    onToggleVolumeSlider,
    onVolumeChange,
    onExtendDuration,
}) => {
    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center justify-center h-60 p-6 mb-6'>
            <div className='flex items-center justify-center gap-4 sm:gap-6 mb-6 flex-wrap'>
                {!isCallActive && !loading && (
                    <button
                        onClick={onStart}
                        disabled={callStarting}
                        className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl ${callStarting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 shadow-green-500/40'
                            } text-white`}
                    >
                        {callStarting ? (
                            <Loader2 className='h-7 w-7 animate-spin' />
                        ) : (
                            <Phone className='h-7 w-7' />
                        )}
                    </button>
                )}

                {isCallActive && (
                    <button
                        onClick={onToggleMute}
                        className={`relative h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isMuted
                            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'
                            : 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-lg shadow-gray-500/30'
                            }`}
                    >
                        {isMuted ? (
                            <VolumeX className='h-6 w-6 text-white' />
                        ) : (
                            <Mic className='h-6 w-6 text-white' />
                        )}
                    </button>
                )}

                {isCallActive && !loading && (
                    <button
                        onClick={onEnd}
                        className='relative h-16 w-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-xl shadow-red-500/40'
                    >
                        <Phone className='h-7 w-7 rotate-[135deg]' />
                    </button>
                )}

                {loading && (
                    <div className='h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center'>
                        <Loader2 className='h-7 w-7 animate-spin text-gray-600 dark:text-gray-300' />
                    </div>
                )}

                {isCallActive && (
                    <div className='relative'>
                        <button
                            onClick={onToggleVolumeSlider}
                            className='relative h-14 w-14 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg shadow-blue-500/30'
                        >
                            <Volume2 className='h-6 w-6' />
                        </button>

                        {showVolumeSlider && (
                            <div className='absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-lg border dark:border-gray-600 z-10'>
                                <input
                                    type='range'
                                    min='0'
                                    max='1'
                                    step='0.1'
                                    value={volume}
                                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                    className='w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider'
                                />
                                <div className='text-xs text-center mt-1 text-gray-600 dark:text-gray-300'>
                                    {Math.round(volume * 100)}%
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>

            <div className='text-center'>
                {callStarting || loading ? (
                    <div className='text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center gap-2'>
                        <div className='w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping' />
                        <span>Connecting with AI Agent...</span>
                    </div>
                ) : isCallActive ? (
                    <div className='text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                        <span>Interview in Progress</span>
                    </div>
                ) : (
                    <div className='space-y-2'>
                        <p className='text-gray-900 dark:text-white font-medium'>
                            Ready to Start Interview
                        </p>
                       
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewControls;