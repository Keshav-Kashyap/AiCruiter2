import { Button } from '@/components/ui/button'
import { Users, Calendar, Trophy, Eye, Star, Clock } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import CandidateFeedbackDiloage from './CandidateFeedbackDiloage'

function CandidatList({ candidateList }) {
    const getScoreColor = (score) => {
        const numScore = parseInt(score?.split('/')[0]) || 0
        const total = parseInt(score?.split('/')[1]) || 10
        const percentage = (numScore / total) * 100

        if (percentage >= 80) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
        if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
    }

    const getScoreBadge = (score) => {
        const numScore = parseInt(score?.split('/')[0]) || 0
        const total = parseInt(score?.split('/')[1]) || 10
        const percentage = (numScore / total) * 100

        if (percentage >= 80) return 'Excellent'
        if (percentage >= 60) return 'Good'
        return 'Needs Improvement'
    }

    const getScoreIcon = (score) => {
        const numScore = parseInt(score?.split('/')[0]) || 0
        const total = parseInt(score?.split('/')[1]) || 10
        const percentage = (numScore / total) * 100

        if (percentage >= 80) return Trophy
        if (percentage >= 60) return Star
        return Clock
    }

    return (
        <div className="mt-8">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Candidates ({candidateList?.length || 0})
                </h2>
                {candidateList?.length > 0 && (
                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                        {candidateList.length} Total
                    </span>
                )}
            </div>

            {/* Candidates List */}
            <div className="space-y-4">
                {candidateList?.map((candidate, index) => (
                    <div
                        key={index}
                        className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                        <div className="flex items-center justify-between">
                            {/* Left Side - Candidate Info */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {candidate?.userName?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                </div>

                                {/* Candidate Details */}
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {candidate?.userName}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>Completed: {moment(candidate?.created_at).format('MMM DD, YYYY')}</span>
                                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                        <Clock className="w-4 h-4" />
                                        <span>{moment(candidate?.created_at).fromNow()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Score and Actions */}
                            <div className="flex items-center gap-4">
                                {/* Score Display */}
                                <div className="text-right space-y-1">
                                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-lg border ${getScoreColor('6/10')}`}>
                                        <Trophy className="w-4 h-4" />
                                        6/10
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            {React.createElement(getScoreIcon('6/10'), { className: 'w-3 h-3' })}
                                            {getScoreBadge('6/10')}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="hidden md:block w-24">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: '60%' }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">60%</div>
                                </div>

                                {/* Action Button */}
                                <div className="flex items-center gap-2">
                                    <CandidateFeedbackDiloage candidate={candidate} />
                                </div>
                            </div>
                        </div>

                        {/* Additional Info (Hidden by default, shown on hover) */}
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        Performance: Good
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        Interview #{index + 1}
                                    </span>
                                </div>
                                <div className="text-gray-500 dark:text-gray-400">
                                    Duration: ~30 mins
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {(!candidateList || candidateList.length === 0) && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Candidates Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Candidates who complete the interview will appear here
                    </p>
                </div>
            )}
        </div>
    )
}

export default CandidatList