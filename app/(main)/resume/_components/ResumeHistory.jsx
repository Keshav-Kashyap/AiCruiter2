"use client"

import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Award, Download, Trash2, Eye, Loader2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const ResumeHistory = ({ userId, onResumeSelect }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchResumes = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/resume-history?userId=${userId}`);
            const data = await response.json();

            if (data.success) {
                setResumes(data.resumes);
            } else {
                toast.error('Failed to load resume history');
            }
        } catch (error) {
            console.error('Error fetching resumes:', error);
            toast.error('Failed to load resume history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, [userId]);

    const handleDelete = async (resumeId) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        setDeletingId(resumeId);
        try {
            const response = await fetch(`/api/resume-history?resumeId=${resumeId}&userId=${userId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Resume deleted successfully');
                setResumes(resumes.filter(r => r.id !== resumeId));
            } else {
                toast.error('Failed to delete resume');
            }
        } catch (error) {
            console.error('Error deleting resume:', error);
            toast.error('Failed to delete resume');
        } finally {
            setDeletingId(null);
        }
    };

    const handleView = (resume) => {
        if (onResumeSelect) {
            onResumeSelect(resume);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading resume history...</span>
            </div>
        );
    }

    if (resumes.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <FileText className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Saved Resumes</h3>
                <p className="text-gray-600 dark:text-gray-400">Upload and analyze a resume to get started</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-600" />
                    Resume History ({resumes.length})
                </h3>
                <Button
                    onClick={fetchResumes}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume) => (
                    <Card key={resume.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                                    {resume.file_name}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(resume.updated_at)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Overall Score</div>
                                <div className={`text-lg font-bold ${getScoreColor(resume.overall_score)}`}>
                                    {resume.overall_score}%
                                </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">ATS Score</div>
                                <div className={`text-lg font-bold ${getScoreColor(resume.ats_score)}`}>
                                    {resume.ats_score}%
                                </div>
                            </div>
                        </div>

                        {resume.improved_content && resume.improved_content !== resume.original_content && (
                            <Badge className="mb-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <Award className="w-3 h-3 mr-1" />
                                Improved
                            </Badge>
                        )}

                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleView(resume)}
                                size="sm"
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                            </Button>
                            <Button
                                onClick={() => handleDelete(resume.id)}
                                disabled={deletingId === resume.id}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                {deletingId === resume.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ResumeHistory;
