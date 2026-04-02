"use client"

import React, { useState, useContext } from 'react';
import { FileText, Upload, PlusCircle, TrendingUp, History } from 'lucide-react';
import ResumeAnalyzer from './_components/ResumeAnalyzer';
import ResumeAnalysisResult from './_components/ResumeAnalysisResult';
import ResumeBuilder from './_components/ResumeBuilder';
import ResumeHistory from './_components/ResumeHistory';
import { UserDetailContext } from '@/app/context/UserDetailContext';

const ResumePage = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [activeTab, setActiveTab] = useState('analyze'); // 'analyze' or 'build'
    const [analysisData, setAnalysisData] = useState(null);
    const [originalResumeText, setOriginalResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [currentResumeId, setCurrentResumeId] = useState(null);

    const handleAnalysisComplete = (data, resumeText, name = 'Untitled Resume') => {
        setAnalysisData(data);
        setOriginalResumeText(resumeText);
        setFileName(name);
    };

    const handleReanalyze = () => {
        setAnalysisData(null);
        setOriginalResumeText('');
        setFileName('');
        setCurrentResumeId(null);
    };

    const handleResumeSelect = (resume) => {
        setAnalysisData(resume.analysis_data);
        setOriginalResumeText(resume.original_content);
        setFileName(resume.file_name);
        setCurrentResumeId(resume.id);
        setActiveTab('analyze');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 inline-flex">
                        <button
                            onClick={() => setActiveTab('analyze')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'analyze'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            Analyze Resume
                        </button>
                        <button
                            onClick={() => setActiveTab('build')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === 'build'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <PlusCircle className="w-5 h-5" />
                            Build Resume
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'analyze' ? (
                        <div>
                            {!analysisData ? (
                                <ResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />
                            ) : (
                                <ResumeAnalysisResult
                                    analysisData={analysisData}
                                    originalResumeText={originalResumeText}
                                    fileName={fileName}
                                    resumeId={currentResumeId}
                                    userId={userDetail?.id}
                                    onReanalyze={handleReanalyze}
                                />
                            )}
                        </div>
                    ) : (
                        <ResumeBuilder />
                    )}
                </div>

                {/* Resume History - Show only if user is logged in */}
                {userDetail?.id && (
                    <div className="max-w-7xl mx-auto mt-12">
                        <ResumeHistory
                            userId={userDetail.id}
                            onResumeSelect={handleResumeSelect}
                        />
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            AI-Powered Analysis
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Get instant feedback on your resume with our advanced AI technology
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            ATS Optimization
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ensure your resume passes Applicant Tracking Systems with high scores
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                            <PlusCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Professional Templates
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Build your resume from scratch using professional templates
                        </p>
                    </div>
                </div>

                {/* Features List */}
                <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 max-w-5xl mx-auto border border-blue-200 dark:border-blue-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        What Makes Our Resume Analyzer Special?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Comprehensive Scoring
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Get detailed scores for each section of your resume
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Actionable Suggestions
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Receive specific recommendations to improve your resume
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    ATS Compatibility
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Check if your resume is optimized for ATS systems
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2" />
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    Resume Builder
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Create professional resumes from scratch with AI assistance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePage;
