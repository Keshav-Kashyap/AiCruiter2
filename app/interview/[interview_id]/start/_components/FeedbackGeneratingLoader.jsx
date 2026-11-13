"use client";

import React from 'react';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';

const STEPS = [
    { id: 1, label: "Securing raw conversation data..." },
    { id: 2, label: "Transcribing and indexing interview response..." },
    { id: 3, label: "Evaluating technical depth & problem-solving..." },
    { id: 4, label: "Assessing communication clarity & fluency..." },
    { id: 5, label: "Generating final recommendation & score..." },
];

const FeedbackGeneratingLoader = ({ currentStep = 0, error = null, onRetry = null }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 select-none overflow-hidden">
            <div className="w-full max-w-md flex flex-col items-start space-y-4">
                
                {/* Header Title */}
                <div className="mb-4 w-full text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Analyzing Interview...
                    </h1>
                </div>

                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep && !error;
                    const isPending = index > currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`relative w-full flex items-center gap-3.5 px-4 py-2 rounded-full transition-all duration-500 ${
                                isCurrent
                                    ? 'bg-sky-500/15 shadow-[0_0_50px_rgba(56,189,248,0.3)] text-white'
                                    : isCompleted
                                    ? 'text-gray-300 opacity-70'
                                    : 'text-gray-500 opacity-40'
                            }`}
                        >
                            {/* Step Icon */}
                            <div className="flex-shrink-0">
                                {isCompleted ? (
                                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 text-slate-300 flex items-center justify-center">
                                        <Check className="w-3 h-3 stroke-[2.5]" />
                                    </div>
                                ) : isCurrent ? (
                                    <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-transparent" />
                                    </div>
                                )}
                            </div>

                            {/* Step Label */}
                            <span
                                className={`text-base tracking-wide transition-colors ${
                                    isCurrent
                                        ? 'text-white font-medium'
                                        : isCompleted
                                        ? 'text-gray-300'
                                        : 'text-gray-500'
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}

                {/* Error State */}
                {error && (
                    <div className="w-full mt-6 p-4 rounded-xl border border-red-800/50 bg-red-950/60 text-red-300 text-xs flex flex-col gap-3">
                        <div className="flex items-center gap-2 font-semibold text-red-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>Analysis Error</span>
                        </div>
                        <p className="text-red-300/80 leading-relaxed">
                            {error}
                        </p>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-colors self-start"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Retry Analysis
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackGeneratingLoader;
