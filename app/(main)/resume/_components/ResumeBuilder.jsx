"use client"

import React, { useState } from 'react';
import { Plus, Trash2, Download, Loader2, FileText, Sparkles, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ResumeBuilder = () => {
    const [generating, setGenerating] = useState(false);
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            portfolio: ''
        },
        summary: '',
        experience: [
            { company: '', position: '', duration: '', description: '' }
        ],
        education: [
            { institution: '', degree: '', year: '', gpa: '' }
        ],
        skills: [],
        projects: [
            { name: '', description: '', technologies: '', link: '' }
        ]
    });

    const [newSkill, setNewSkill] = useState('');

    const handlePersonalInfoChange = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [field]: value
            }
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...resumeData.experience];
        newExperience[index][field] = value;
        setResumeData(prev => ({ ...prev, experience: newExperience }));
    };

    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
        }));
    };

    const removeExperience = (index) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...resumeData.education];
        newEducation[index][field] = value;
        setResumeData(prev => ({ ...prev, education: newEducation }));
    };

    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
        }));
    };

    const removeEducation = (index) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            setResumeData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        setResumeData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...resumeData.projects];
        newProjects[index][field] = value;
        setResumeData(prev => ({ ...prev, projects: newProjects }));
    };

    const addProject = () => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, { name: '', description: '', technologies: '', link: '' }]
        }));
    };

    const removeProject = (index) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const generateResume = async () => {
        // Validate required fields
        if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email) {
            toast.error('Please fill in your name and email');
            return;
        }

        setGenerating(true);

        try {
            const response = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resumeData),
            });

            if (!response.ok) {
                throw new Error('Failed to generate resume');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Resume generated and downloaded successfully!');
        } catch (error) {
            console.error('Error generating resume:', error);
            toast.error('Failed to generate resume. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const enhanceWithAI = async () => {
        setGenerating(true);
        try {
            const response = await fetch('/api/enhance-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resumeData),
            });

            if (!response.ok) {
                throw new Error('Failed to enhance resume');
            }

            const enhancedData = await response.json();
            setResumeData(enhancedData.resumeData);
            toast.success('Resume enhanced with AI suggestions!');
        } catch (error) {
            console.error('Error enhancing resume:', error);
            toast.error('Failed to enhance resume. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Builder</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Create a professional resume from scratch</p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Full Name *"
                            value={resumeData.personalInfo.fullName}
                            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                        />
                        <Input
                            type="email"
                            placeholder="Email *"
                            value={resumeData.personalInfo.email}
                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        />
                        <Input
                            placeholder="Phone"
                            value={resumeData.personalInfo.phone}
                            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        />
                        <Input
                            placeholder="Location"
                            value={resumeData.personalInfo.location}
                            onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        />
                        <Input
                            placeholder="LinkedIn URL"
                            value={resumeData.personalInfo.linkedin}
                            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        />
                        <Input
                            placeholder="Portfolio URL"
                            value={resumeData.personalInfo.portfolio}
                            onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                        />
                    </div>
                </div>

                {/* Professional Summary */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Professional Summary</h3>
                    <Textarea
                        placeholder="Write a brief professional summary about yourself..."
                        value={resumeData.summary}
                        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                        rows={4}
                    />
                </div>

                {/* Experience */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h3>
                        <Button onClick={addExperience} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Experience
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {resumeData.experience.map((exp, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience {index + 1}</h4>
                                    {resumeData.experience.length > 1 && (
                                        <Button
                                            onClick={() => removeExperience(index)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Position"
                                        value={exp.position}
                                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Duration (e.g., Jan 2020 - Present)"
                                        value={exp.duration}
                                        onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                        className="md:col-span-2"
                                    />
                                    <Textarea
                                        placeholder="Job description and achievements..."
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        rows={3}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
                        <Button onClick={addEducation} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Education
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Education {index + 1}</h4>
                                    {resumeData.education.length > 1 && (
                                        <Button
                                            onClick={() => removeEducation(index)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                        placeholder="Institution"
                                        value={edu.institution}
                                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Year"
                                        value={edu.year}
                                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                    />
                                    <Input
                                        placeholder="GPA (Optional)"
                                        value={edu.gpa}
                                        onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
                    <div className="flex gap-2 mb-3">
                        <Input
                            placeholder="Add a skill (e.g., JavaScript, React, Python)"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button onClick={addSkill}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                                <span>{skill}</span>
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="hover:text-red-600 dark:hover:text-red-400"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Projects */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h3>
                        <Button onClick={addProject} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Project
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {resumeData.projects.map((project, index) => (
                            <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Project {index + 1}</h4>
                                    {resumeData.projects.length > 1 && (
                                        <Button
                                            onClick={() => removeProject(index)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <Input
                                        placeholder="Project Name"
                                        value={project.name}
                                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Project Description"
                                        value={project.description}
                                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                        rows={2}
                                    />
                                    <Input
                                        placeholder="Technologies Used"
                                        value={project.technologies}
                                        onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Project Link (Optional)"
                                        value={project.link}
                                        onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        onClick={enhanceWithAI}
                        disabled={generating}
                        variant="outline"
                        className="flex-1"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enhancing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Enhance with AI
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={generateResume}
                        disabled={generating}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Generate Resume
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
