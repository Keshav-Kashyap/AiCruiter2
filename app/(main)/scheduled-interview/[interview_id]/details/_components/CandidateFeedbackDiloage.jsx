import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supaBaseClient'
import {
    Mail, User, Trophy, TrendingUp, MessageSquare, Lightbulb,
    CheckCircle, XCircle, Star, Code, Zap, Briefcase, FileText,
    CheckCircle2, AlertTriangle, Sparkles, Target, Brain, AlertCircle,
    Info, ShieldAlert, Loader2
} from 'lucide-react'

function CandidateFeedbackDiloage({ candidate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchedRecord, setFetchedRecord] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        // If feedback is already present directly on candidate, no need to fetch
        if (candidate?.feedback) {
            setFetchedRecord(null);
            return;
        }

        // Fetch feedback column directly from Supabase interview-feedback table
        const fetchFeedbackFromSupabase = async () => {
            setLoading(true);
            try {
                let query = supabase.from('interview-feedback').select('*');
                if (candidate?.id) {
                    query = query.eq('id', candidate.id);
                } else if (candidate?.interview_id) {
                    query = query.eq('interview_id', candidate.interview_id);
                    if (candidate?.userEmail) {
                        query = query.eq('userEmail', candidate.userEmail);
                    }
                } else {
                    setLoading(false);
                    return;
                }

                const { data, error } = await query.order('id', { ascending: false }).limit(1);
                if (!error && data && data.length > 0) {
                    setFetchedRecord(data[0]);
                }
            } catch (err) {
                console.error("Error fetching feedback from Supabase:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbackFromSupabase();
    }, [isOpen, candidate]);

    const activeCandidate = { ...candidate, ...fetchedRecord };

    let feedbackRaw = activeCandidate?.feedback;
    if (typeof feedbackRaw === 'string') {
        try {
            feedbackRaw = JSON.parse(feedbackRaw);
        } catch (e) {
            console.error("Failed to parse candidate feedback JSON:", e);
        }
    }
    const feedback = feedbackRaw?.feedback || feedbackRaw;

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

    // Determine scale (5 or 10) dynamically based on ratings
    const maxScale = (() => {
        if (!feedback?.rating) return 10;
        const vals = [
            feedback.finalScore,
            activeCandidate?.final_score,
            ...Object.values(feedback.rating).map(v => parseFloat(v) || 0)
        ].filter(v => v !== null && v !== undefined && !isNaN(v));

        const maxVal = Math.max(...vals, 0);
        return maxVal <= 5 ? 5 : 10;
    })();

    // Calculate Overall Score safely
    const overallScore = (() => {
        if (feedback?.finalScore !== undefined && feedback?.finalScore !== null) {
            return parseFloat(feedback.finalScore) || 0;
        }
        if (activeCandidate?.final_score !== undefined && activeCandidate?.final_score !== null) {
            return parseFloat(activeCandidate.final_score) || 0;
        }
        if (feedback?.rating?.overall !== undefined && feedback?.rating?.overall !== null) {
            return parseFloat(feedback.rating.overall) || 0;
        }
        if (!feedback?.rating) return 0;
        const ratings = Object.entries(feedback.rating)
            .filter(([k]) => k !== 'overall')
            .map(([, v]) => parseFloat(v) || 0);
        if (ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating, 0);
        return Math.round((total / ratings.length) * 10) / 10;
    })();

    const scorePercentage = Math.round((overallScore / maxScale) * 100);

    const isRecommended = typeof feedback?.recommendation === 'boolean'
        ? feedback.recommendation
        : (feedback?.Recommendation !== 'Not Recommended');

    const recommendationText = typeof feedback?.recommendation === 'boolean'
        ? (feedback.recommendation ? "Recommended" : "Not Recommended")
        : (feedback?.Recommendation || (isRecommended ? "Recommended" : "Not Recommended"));

    const recommendationMessage = feedback?.recommendationMessage || feedback?.RecommendationMsg || "";
    const summaryText = feedback?.summary || feedback?.summery || "No evaluation summary provided.";
    const interviewStatus = feedback?.interviewStatus || (isRecommended ? "Completed" : "Action Required");
    const isIncomplete = interviewStatus.toLowerCase().includes('incomplete') || summaryText.toLowerCase().includes('no interview conversation');

    const getSkillColor = (rating) => {
        const val = parseFloat(rating) || 0;
        const ratio = val / maxScale;
        if (ratio >= 0.8) return 'text-emerald-600 dark:text-emerald-400';
        if (ratio >= 0.6) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    const getProgressGradient = (rating) => {
        const val = parseFloat(rating) || 0;
        const ratio = val / maxScale;
        if (ratio >= 0.8) return 'from-emerald-500 to-teal-500';
        if (ratio >= 0.6) return 'from-amber-500 to-orange-500';
        return 'from-rose-500 to-red-500';
    };

    const getSkillLevelBadge = (rating) => {
        const val = parseFloat(rating) || 0;
        const ratio = val / maxScale;
        if (ratio >= 0.85) return { label: 'Expert', bg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
        if (ratio >= 0.7) return { label: 'Proficient', bg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' };
        if (ratio >= 0.5) return { label: 'Developing', bg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' };
        return { label: 'Needs Work', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' };
    };

    const getAssessmentBadgeStyle = (assessmentText) => {
        const text = String(assessmentText || '').toLowerCase();
        if (text.includes('good') || text.includes('excellent') || text.includes('high') || text.includes('strong') || text.includes('proficient')) {
            return 'bg-emerald-100/80 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
        }
        if (text.includes('average') || text.includes('moderate') || text.includes('fair') || text.includes('developing')) {
            return 'bg-sky-100/80 text-sky-800 border-sky-300 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800';
        }
        return 'bg-amber-100/80 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    };

    const renderStars = (score) => {
        const percentage = (score / maxScale) * 100;
        const starCount = 5;
        const filledStars = (percentage / 100) * starCount;
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                    const fillAmount = Math.max(0, Math.min(1, filledStars - (star - 1)));
                    return (
                        <div key={star} className="relative w-4 h-4">
                            <Star className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            {fillAmount > 0 && (
                                <div
                                    className="absolute top-0 left-0 overflow-hidden"
                                    style={{ width: `${fillAmount * 100}%` }}
                                >
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className='text-primary dark:text-primary-400 hover:bg-primary/10 dark:hover:bg-primary/10 border-primary dark:border-primary-400 transition-all duration-200 shadow-sm'>
                    <Trophy className="w-4 h-4 mr-2" />
                    View Report
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:w-[90vw] max-w-5xl lg:max-w-6xl max-h-[92vh] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <span className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 shrink-0">
                                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <span className="truncate">Interview Evaluation Report</span>
                        </span>
                        <span className={`text-xs px-3 py-1.5 sm:px-3.5 rounded-full font-semibold border flex items-center gap-1.5 shadow-sm self-start sm:self-auto ${isIncomplete
                                ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                                : isRecommended
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                    : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                            }`}>
                            {isIncomplete ? <AlertCircle className="w-3.5 h-3.5" /> : isRecommended ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {interviewStatus}
                        </span>
                    </DialogTitle>

                    <DialogDescription asChild>
                        {loading ? (
                            <div className="py-16 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                    Fetching candidate feedback from Supabase...
                                </p>
                            </div>
                        ) : (
                            <div className='mt-4 space-y-5 sm:space-y-6'>
                                {/* Candidate Header Card */}
                                <div className='p-4 sm:p-6 bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-blue-50/90 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-blue-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm relative overflow-hidden'>
                                    <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

                                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10'>
                                        <div className='flex items-center gap-3 sm:gap-4'>
                                            <div className='relative shrink-0'>
                                                <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl sm:text-2xl shadow-md'>
                                                    {activeCandidate?.userName?.[0]?.toUpperCase() || 'C'}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center ${isRecommended ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                </div>
                                            </div>
                                            <div className='space-y-0.5 sm:space-y-1 min-w-0'>
                                                <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate'>
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                                    <span className="truncate">{activeCandidate?.userName || "Candidate"}</span>
                                                </h3>
                                                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 truncate'>
                                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                                                    <span className="truncate">{activeCandidate?.userEmail || "No email provided"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Overall Score Box */}
                                        <div className='w-full sm:w-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3.5 sm:p-4 px-4 sm:px-6 rounded-2xl border border-indigo-100 dark:border-gray-700/60 shadow-sm flex items-center sm:flex-col justify-between sm:justify-center gap-2'>
                                            <div className="flex items-baseline gap-1">
                                                <span className={`text-2xl sm:text-4xl font-black ${getSkillColor(overallScore)}`}>
                                                    {overallScore}
                                                </span>
                                                <span className="text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-500">
                                                    /{maxScale}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end sm:items-center gap-1">
                                                {renderStars(overallScore)}
                                                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400">
                                                    {scorePercentage}% Score
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Incomplete Interview Alert Banner */}
                                {isIncomplete && (
                                    <div className="p-3.5 sm:p-4 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 sm:gap-3 text-amber-900 dark:text-amber-200">
                                        <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                        <div className="space-y-1 text-xs sm:text-sm">
                                            <p className="font-bold">Incomplete Recording Data</p>
                                            <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                                                No full interview conversation content was recorded for this candidate. Evaluation scores and decision recommendations are generated based on limited transcript data. Reconducting the session is strongly advised.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Skills Assessment Section */}
                                {feedback?.rating && (
                                    <div className='space-y-3 sm:space-y-4'>
                                        <div className="flex items-center justify-between">
                                            <h2 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />
                                                Skills & Competencies
                                            </h2>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Scale: 0 - {maxScale}
                                            </span>
                                        </div>

                                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4'>
                                            {Object.entries(feedback.rating)
                                                .filter(([skill]) => skill !== 'overall')
                                                .map(([skill, rating]) => {
                                                    const IconComponent = skillIcons[skill] || Star;
                                                    const label = skillLabels[skill] || skill.replace(/([A-Z])/g, ' $1').trim();
                                                    const numRating = parseFloat(rating) || 0;
                                                    const levelBadge = getSkillLevelBadge(numRating);
                                                    const fillPercentage = Math.min(100, Math.max(0, (numRating / maxScale) * 100));

                                                    return (
                                                        <div key={skill} className='p-3.5 sm:p-4 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/70 dark:border-gray-700/60 space-y-2.5 sm:space-y-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors'>
                                                            <div className='flex items-center justify-between'>
                                                                <div className="flex items-center gap-2 sm:gap-2.5">
                                                                    <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shrink-0">
                                                                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className='font-bold text-xs sm:text-sm text-gray-900 dark:text-white capitalize'>
                                                                            {label}
                                                                        </h3>
                                                                        <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold ${levelBadge.bg}`}>
                                                                            {levelBadge.label}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className={`font-black text-sm sm:text-base ${getSkillColor(numRating)}`}>
                                                                        {numRating}
                                                                    </span>
                                                                    <span className="text-[10px] sm:text-xs font-medium text-gray-400">
                                                                        /{maxScale}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Custom Gradient Progress Bar */}
                                                            <div className="space-y-1">
                                                                <div className="w-full bg-gray-200 dark:bg-gray-700/60 rounded-full h-2 overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full bg-gradient-to-r ${getProgressGradient(numRating)} transition-all duration-500`}
                                                                        style={{ width: `${fillPercentage}%` }}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                                                                    <span>0</span>
                                                                    <span>{maxScale / 2}</span>
                                                                    <span>{maxScale}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}

                                {/* Technical & Communication Detailed Breakdown */}
                                {(feedback?.technicalAssessment || feedback?.communicationAssessment) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        {/* Technical Assessment Card */}
                                        {feedback?.technicalAssessment && (
                                            <div className="p-4 sm:p-5 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/70 dark:border-gray-700/60 space-y-3">
                                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-xs sm:text-sm">
                                                    <Code className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                                    Technical Competencies
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(feedback.technicalAssessment).map(([key, val]) => (
                                                        <div key={key} className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 space-y-1 shadow-2xs">
                                                            <span className="text-gray-500 dark:text-gray-400 block capitalize text-[10px] sm:text-[11px] font-semibold truncate">
                                                                {key.replace(/([A-Z])/g, ' $1')}
                                                            </span>
                                                            <span className={`inline-block px-2.5 py-0.5 sm:py-1 rounded-md font-bold text-[10px] sm:text-[11px] border ${getAssessmentBadgeStyle(val)}`}>
                                                                {val}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Communication Assessment Card */}
                                        {feedback?.communicationAssessment && (
                                            <div className="p-4 sm:p-5 bg-gray-50/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/70 dark:border-gray-700/60 space-y-3">
                                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-xs sm:text-sm">
                                                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                                    Communication & Fluency
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(feedback.communicationAssessment).map(([key, val]) => (
                                                        <div key={key} className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 space-y-1 shadow-2xs">
                                                            <span className="text-gray-500 dark:text-gray-400 block capitalize text-[10px] sm:text-[11px] font-semibold truncate">
                                                                {key.replace(/([A-Z])/g, ' $1')}
                                                            </span>
                                                            <span className={`inline-block px-2.5 py-0.5 sm:py-1 rounded-md font-bold text-[10px] sm:text-[11px] border ${getAssessmentBadgeStyle(val)}`}>
                                                                {val}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Strengths & Areas for Improvement */}
                                {(feedback?.strengths?.length > 0 || feedback?.areasForImprovement?.length > 0) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                        {/* Strengths Card */}
                                        {feedback?.strengths?.length > 0 && (
                                            <div className="p-4 sm:p-5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-2.5 sm:space-y-3">
                                                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-xs sm:text-sm">
                                                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    Key Strengths
                                                </h3>
                                                <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-200">
                                                    {feedback.strengths.map((strength, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed font-medium">{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Areas for Improvement Card */}
                                        {feedback?.areasForImprovement?.length > 0 && (
                                            <div className="p-4 sm:p-5 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/50 space-y-2.5 sm:space-y-3">
                                                <h3 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 text-xs sm:text-sm">
                                                    <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                                                    Areas for Improvement
                                                </h3>
                                                <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-200">
                                                    {feedback.areasForImprovement.map((area, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                                            <span className="leading-relaxed font-medium">{area}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Executive Performance Summary */}
                                <div className='space-y-2.5 sm:space-y-3'>
                                    <h2 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                                        <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        Executive Summary
                                    </h2>

                                    <div className='p-4 sm:p-5 bg-gray-50/90 dark:bg-gray-800/60 rounded-xl border border-gray-200/70 dark:border-gray-700/70 relative overflow-hidden shadow-2xs'>
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
                                        <p className='text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed pl-2.5 sm:pl-3 font-normal'>
                                            {summaryText}
                                        </p>
                                    </div>
                                </div>

                                {/* Final Recommendation Decision Box */}
                                <div className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm ${isRecommended
                                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                                        : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                                    }`}>
                                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5'>
                                        <div className='flex-1 space-y-2 min-w-0'>
                                            <div className='flex items-center gap-2'>
                                                {isRecommended ? (
                                                    <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
                                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 sm:p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 shrink-0">
                                                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                )}
                                                <h2 className={`text-base sm:text-lg font-bold ${isRecommended
                                                        ? 'text-emerald-900 dark:text-emerald-300'
                                                        : 'text-rose-900 dark:text-rose-300'
                                                    }`}>
                                                    Recommendation Decision
                                                </h2>
                                            </div>
                                            {recommendationMessage && (
                                                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isRecommended
                                                        ? 'text-emerald-800/90 dark:text-emerald-200/90'
                                                        : 'text-rose-800/90 dark:text-rose-200/90'
                                                    }`}>
                                                    {recommendationMessage}
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-full sm:w-auto shrink-0 flex justify-end">
                                            <span className={`w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm ${isRecommended
                                                    ? 'bg-emerald-600 text-white dark:bg-emerald-700'
                                                    : 'bg-rose-600 text-white dark:bg-rose-700'
                                                }`}>
                                                {isRecommended ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {recommendationText}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CandidateFeedbackDiloage