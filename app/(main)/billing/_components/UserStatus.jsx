"use client"
import { useUser } from '@/app/provider'
import { Progress } from '@/components/ui/progress'
import { Loader2Icon, Rocket, Calendar, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const UserStatus = () => {
    const [loading, setLoading] = useState(true);
    const userObj = useUser();

    useEffect(() => {
        if (userObj) {
            setLoading(false);
        }
    }, [userObj])

    const user = userObj?.user;
    console.log("user credits", user?.credits);
    const creditsUsed = 3 - (user?.credits || 0);
    const progressValue = (creditsUsed / 100) * 100;



    return (
        <>
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center space-x-3">
                            <Loader2Icon className='animate-spin w-6 h-6 text-blue-500' />
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Loading your status...</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="bg-gradient-to-br from-white/80 to-blue-50/50 dark:from-gray-800/80 dark:to-blue-900/20 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12 border border-gray-200/50 dark:border-gray-700/50 border-l-4 border-l-blue-500 dark:border-l-blue-400">
                    {/* Header with gradient background */}
                    <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
                        <div className="flex items-center space-x-6">
                            {/* Credits Display */}
                            <div className="relative">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
                                <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-4 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                                    <Rocket className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2" />
                                </div>
                            </div>

                            <div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    {user?.credits || 0}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Credits Remaining</div>
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                    {creditsUsed} credits used
                                </div>
                            </div>
                        </div>

                        {/* Expiry Date */}
                        <div className="flex items-center space-x-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-200/50 dark:border-gray-600/50">
                            <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <div className="text-center">
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                    Free Plan
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    30/01/3000
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credits Progress Bar */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Zap className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Credits Usage</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {creditsUsed}/3 used
                            </span>
                        </div>

                        {/* Enhanced Progress Bar Container */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur"></div>
                            <div className="relative bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200/50 dark:border-gray-600/50">
                                <Progress
                                    value={progressValue}
                                    className="h-3 bg-gray-200 dark:bg-gray-600"
                                />
                            </div>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${progressValue < 50
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : progressValue < 80
                                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {progressValue < 50 ? 'Plenty of credits' : progressValue < 80 ? 'Moderate usage' : 'Consider upgrading'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {user?.credits || 0} credits left
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserStatus