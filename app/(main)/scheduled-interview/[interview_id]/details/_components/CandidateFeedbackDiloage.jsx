import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Mail, User, Trophy, TrendingUp, MessageSquare, Lightbulb, CheckCircle, XCircle, Star, Code, Users, Zap, Briefcase } from 'lucide-react'

function CandidateFeedbackDiloage({ candidate }) {
    const feedback = candidate?.feedback?.feedback;
    console.log(feedback);

    const skillIcons = {
        technicalSkills: Code,
        communication: MessageSquare,
        problemSolving: Zap,
        experience: Briefcase
    };

    const skillLabels = {
        technicalSkills: 'Technical Skills',
        communication: 'Communication',
        problemSolving: 'Problem Solving',
        experience: 'Experience'
    };

    const getSkillColor = (rating) => {
        if (rating >= 8) return 'text-green-600 dark:text-green-400';
        if (rating >= 6) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getProgressColor = (rating) => {
        if (rating >= 8) return 'bg-green-500';
        if (rating >= 6) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const calculateOverallScore = () => {
        if (!feedback?.rating) return 0;
        const ratings = Object.values(feedback.rating);
        const total = ratings.reduce((sum, rating) => sum + rating, 0);
        return Math.round(total / ratings.length);
    };

    const overallScore = calculateOverallScore();
    const isRecommended = feedback?.Recommendation !== 'Not Recommended';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className='text-primary dark:text-primary-400 hover:bg-primary/10 dark:hover:bg-primary/10 border-primary dark:border-primary-400 transition-all duration-200'>
                    <Trophy className="w-4 h-4 mr-2" />
                    View Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-primary" />
                        Interview Feedback Report
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-6 space-y-6'>
                            {/* Candidate Header */}
                            <div className='p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-4'>
                                        <div className='relative'>
                                            <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg'>
                                                {candidate?.userName?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                                        </div>
                                        <div className='space-y-1'>
                                            <h3 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                                <User className="w-5 h-5" />
                                                {candidate?.userName}
                                            </h3>
                                            <p className='text-gray-600 dark:text-gray-300 flex items-center gap-2'>
                                                <Mail className="w-4 h-4" />
                                                {candidate?.userEmail}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='text-right'>
                                        <div className={`text-4xl font-bold ${getSkillColor(overallScore)} mb-1`}>
                                            {overallScore}/10
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                                            Overall Score
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Assessment */}
                            <div className='space-y-4'>
                                <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    Skills Assessment
                                </h2>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {feedback?.rating && Object.entries(feedback.rating).map(([skill, rating]) => {
                                        const IconComponent = skillIcons[skill];
                                        return (
                                            <div key={skill} className='p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
                                                <div className='flex items-center justify-between mb-3'>
                                                    <div className="flex items-center gap-2">
                                                        {IconComponent && <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                                        <h3 className='font-medium text-gray-900 dark:text-white'>
                                                            {skillLabels[skill]}
                                                        </h3>
                                                    </div>
                                                    <span className={`font-bold ${getSkillColor(rating)}`}>
                                                        {rating}/10
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    <Progress
                                                        value={rating * 10}
                                                        className="h-2"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                        <span>Beginner</span>
                                                        <span>Expert</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className='space-y-4'>
                                <h2 className='text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                    <Lightbulb className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    Performance Summary
                                </h2>

                                <div className='p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden'>
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <p className='text-gray-700 dark:text-gray-200 leading-relaxed pl-4'>
                                        {feedback?.summery}
                                    </p>
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${isRecommended
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                                }`}>
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='flex-1 space-y-3'>
                                        <h2 className={`text-lg font-bold flex items-center gap-2 ${isRecommended
                                                ? 'text-green-700 dark:text-green-400'
                                                : 'text-red-700 dark:text-red-400'
                                            }`}>
                                            {isRecommended ? (
                                                <CheckCircle className="w-5 h-5" />
                                            ) : (
                                                <XCircle className="w-5 h-5" />
                                            )}
                                            Recommendation
                                        </h2>
                                        <p className={`leading-relaxed ${isRecommended
                                                ? 'text-green-600 dark:text-green-300'
                                                : 'text-red-600 dark:text-red-300'
                                            }`}>
                                            {feedback?.RecommendationMsg}
                                        </p>
                                    </div>
                                    <Button
                                        className={`shrink-0 font-semibold transition-all duration-200 ${isRecommended
                                                ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                                                : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                                            } text-white`}
                                        size="lg"
                                    >
                                        {isRecommended ? (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        ) : (
                                            <XCircle className="w-4 h-4 mr-2" />
                                        )}
                                        {feedback?.Recommendation}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CandidateFeedbackDiloage