"use client"

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const ResumeAnalyzer = ({ onAnalysisComplete, analysisData }) => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        // Validate file type
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!validTypes.includes(uploadedFile.type) && !uploadedFile.name.match(/\.(pdf|docx|txt)$/i)) {
            toast.error('Please upload a PDF, DOCX, or TXT file');
            return;
        }

        // Validate file size (max 5MB)
        if (uploadedFile.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        setFile(uploadedFile);
        toast.success('Resume uploaded successfully!');
    };

    const analyzeResume = async () => {
        if (!file) {
            toast.error('Please upload a resume first');
            return;
        }

        setAnalyzing(true);
        setUploadProgress(0);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Read file content
            const text = await readFileContent(file);

            // Call AI analysis API
            const response = await fetch('/api/analyze-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resumeText: text,
                    fileName: file.name
                }),
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (!response.ok) {
                throw new Error('Failed to analyze resume');
            }

            const data = await response.json();

            if (onAnalysisComplete) {
                onAnalysisComplete(data, text, file.name);
            }

            toast.success('Resume analyzed successfully!');
        } catch (error) {
            console.error('Error analyzing resume:', error);
            toast.error('Failed to analyze resume. Please try again.');
        } finally {
            setAnalyzing(false);
            setUploadProgress(0);
        }
    };

    const readFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const text = e.target.result;
                resolve(text);
            };

            reader.onerror = (error) => reject(error);

            // For PDF and DOCX, we'll read as text (in production, you'd use proper parsers)
            reader.readAsText(file);
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Resume Analyzer</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Upload your resume to get instant AI-powered analysis</p>
                </div>
            </div>

            {/* Upload Area */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Resume
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="resume-upload"
                        disabled={analyzing}
                    />
                    <label
                        htmlFor="resume-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                    >
                        {file ? (
                            <>
                                <FileText className="w-12 h-12 text-green-600 dark:text-green-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setFile(null);
                                    }}
                                    disabled={analyzing}
                                >
                                    Change File
                                </Button>
                            </>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PDF, DOCX, or TXT (Max 5MB)
                                    </p>
                                </div>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Progress Bar */}
            {analyzing && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Analyzing Resume...
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {uploadProgress}%
                        </span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                </div>
            )}

            {/* Analyze Button */}
            <Button
                onClick={analyzeResume}
                disabled={!file || analyzing}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
                {analyzing ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Resume...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Analyze Resume
                    </>
                )}
            </Button>

            {/* Quick Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">What you'll get:</h4>
                <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Overall resume score (0-100)
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Detailed section analysis
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Improvement suggestions
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        ATS compatibility check
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;
