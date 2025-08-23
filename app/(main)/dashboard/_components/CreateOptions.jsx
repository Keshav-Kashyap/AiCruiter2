import { Phone, Video, ArrowRight, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateOptions = () => {
    return (
        <div className='grid sm:grid-cols-2 grid-cols-1 gap-6'>

            {/* Create New Interview Card */}
            <Link href={'/dashboard/create-interview'}>
                <div className='group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm'>

                    {/* Header with Icon and Status */}
                    <div className='flex items-center justify-between mb-2'>
                        <div className='relative'>
                            <div className='absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300'></div>
                            <Video className='relative p-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-xl h-14 w-14 group-hover:scale-110 transition-transform duration-200' />
                        </div>

                        <div className='flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-700'>
                            <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></div>
                            <span className='text-xs font-semibold text-emerald-700 dark:text-emerald-400'>
                                Available
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className='flex-1'>
                        <h2 className='font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200'>
                            Create New Interview
                        </h2>
                        <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4'>
                            Create AI-powered interviews and schedule them with candidates seamlessly
                        </p>

                        {/* Features */}
                        <div className='flex flex-wrap gap-2 mb-4'>
                            <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full'>
                                <Users className='w-3 h-3' />
                                AI Powered
                            </div>
                            <div className='flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-full'>
                                <Clock className='w-3 h-3' />
                                Quick Setup
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700'>
                        <span className='text-xs font-medium text-blue-600 dark:text-blue-400'>
                            Start Creating →
                        </span>
                        <ArrowRight className='w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200' />
                    </div>
                </div>
            </Link>

            {/* Phone Screening Card (Disabled) */}
            <div className='group bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/30 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-6 flex flex-col gap-4 cursor-not-allowed relative overflow-hidden backdrop-blur-sm opacity-75'>

                {/* Disabled Overlay */}
                <div className='absolute inset-0 bg-white/10 dark:bg-gray-900/20 backdrop-blur-[1px] z-10'></div>

                {/* Header with Icon and Unavailable Status */}
                <div className='flex items-center justify-between mb-2 relative z-20'>
                    <div className='relative'>
                        <div className='absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl blur opacity-20'></div>
                        <Phone className='relative p-3 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 rounded-xl h-14 w-14' />
                    </div>

                    <div className='flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-700'>
                        <div className='w-2 h-2 bg-red-500 rounded-full'></div>
                        <span className='text-xs font-semibold text-red-700 dark:text-red-400'>
                            Unavailable
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className='flex-1 relative z-20'>
                    <h2 className='font-bold text-lg text-gray-700 dark:text-gray-300 mb-2'>
                        Create Phone Screening Call
                    </h2>
                    <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4'>
                        Schedule phone screening calls with candidates for initial assessment
                    </p>

                    {/* Coming Soon Badge */}
                    <div className='inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 px-3 py-1.5 rounded-full mb-4'>
                        <Clock className='w-3 h-3 text-orange-600 dark:text-orange-400' />
                        <span className='text-xs font-semibold text-orange-700 dark:text-orange-400'>
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Action Footer */}
                <div className='flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600 relative z-20'>
                    <span className='text-xs font-medium text-gray-400 dark:text-gray-500'>
                        Feature in Development
                    </span>
                    <div className='w-4 h-4 text-gray-300 dark:text-gray-600'>
                        <svg fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateOptions