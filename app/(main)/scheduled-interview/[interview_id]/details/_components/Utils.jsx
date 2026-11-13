import { Trophy, Star, AlertCircle } from 'lucide-react'

export const parseScore = (score) => {
    if (score === null || score === undefined) return 0
    if (typeof score === 'number') return score
    if (typeof score === 'string' && score.includes('/')) {
        return parseFloat(score.split('/')[0]) || 0
    }
    return parseFloat(score) || 0
}

export const getScoreColor = (score) => {
    const numScore = parseScore(score)
    const percentage = (numScore / 10) * 100

    if (percentage >= 80) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
}

export const getScoreBadge = (score) => {
    if (score === null || score === undefined) return 'Not Scored'
    const numScore = parseScore(score)
    const percentage = (numScore / 10) * 100
    if (percentage >= 80) return 'Excellent'
    if (percentage >= 60) return 'Good'
    return 'Needs Improvement'
}

export const getScoreIcon = (score) => {
    const numScore = parseScore(score)
    const percentage = (numScore / 10) * 100
    if (percentage >= 80) return Trophy
    if (percentage >= 60) return Star
    return AlertCircle
}

export const getProgressBarColor = (score) => {
    const numScore = parseScore(score)
    const percentage = (numScore / 10) * 100
    if (percentage >= 80) return 'bg-gradient-to-r from-green-400 to-green-600'
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-400 to-amber-500'
    return 'bg-gradient-to-r from-red-400 to-rose-600'
}
