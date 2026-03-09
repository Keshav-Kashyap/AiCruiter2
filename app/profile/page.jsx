"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { CheckCircle, ArrowRight, ArrowLeft, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProfileSetup = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userType, setUserType] = useState('');
    const [hearAbout, setHearAbout] = useState('');

    const userTypeOptions = [
        {
            id: 'recruiter',
            title: 'Recruiter',
            description: 'I recruit candidates for my organization',
            icon: Briefcase,
        },
        {
            id: 'personal',
            title: 'Personal Use',
            description: 'I want to practice interviews for myself',
            icon: User,
        },
    ];

    const hearAboutOptions = [
        { id: 'google', label: 'Google Search' },
        { id: 'social', label: 'Social Media' },
        { id: 'friend', label: 'Friend or Colleague' },
        { id: 'youtube', label: 'YouTube' },
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'blog', label: 'Blog or Article' },
        { id: 'advertisement', label: 'Advertisement' },
        { id: 'other', label: 'Other' },
    ];

    const handleNext = () => {
        if (currentStep === 1 && userType) {
            setCurrentStep(2);
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    const handleSubmit = () => {
        // Here you can save the data
        console.log('User Type:', userType);
        console.log('Heard About:', hearAbout);
        // Redirect to dashboard or next page
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all",
                            currentStep === 1 ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                        )}>
                            {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : "1"}
                        </div>
                        <div className={cn(
                            "h-1 w-24 transition-all",
                            currentStep === 2 ? "bg-blue-600" : "bg-gray-300"
                        )}></div>
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all",
                            currentStep === 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
                        )}>
                            2
                        </div>
                    </div>
                    <p className="text-center text-gray-600 text-sm">
                        Step {currentStep} of 2
                    </p>
                </div>

                <Card className="overflow-hidden bg-white border border-gray-200 shadow-lg">
                    <CardContent className="p-8 md:p-12">
                        {/* Step 1: User Type */}
                        {currentStep === 1 && (
                            <FieldGroup>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                        Who are you?
                                    </h1>
                                    <p className="text-gray-600">
                                        Help us personalize your experience
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {userTypeOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setUserType(option.id)}
                                                className={cn(
                                                    "relative p-8 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg",
                                                    userType === option.id
                                                        ? "border-blue-600 bg-blue-50 shadow-md"
                                                        : "border-gray-200 bg-white hover:border-gray-300"
                                                )}
                                            >
                                                <div className="flex flex-col items-center text-center space-y-4">
                                                    <div className={cn(
                                                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                                        userType === option.id ? "bg-blue-600" : "bg-gray-100"
                                                    )}>
                                                        <Icon className={cn(
                                                            "w-8 h-8",
                                                            userType === option.id ? "text-white" : "text-gray-600"
                                                        )} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                            {option.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                {userType === option.id && (
                                                    <div className="absolute top-4 right-4">
                                                        <CheckCircle className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <Button
                                    onClick={handleNext}
                                    disabled={!userType}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 h-12 text-lg"
                                >
                                    Continue
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </FieldGroup>
                        )}

                        {/* Step 2: How did you hear about us */}
                        {currentStep === 2 && (
                            <FieldGroup>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                        How did you hear about us?
                                    </h1>
                                    <p className="text-gray-600">
                                        We'd love to know how you found AICruiter
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-8">
                                    {hearAboutOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => setHearAbout(option.id)}
                                            className={cn(
                                                "relative p-5 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md",
                                                hearAbout === option.id
                                                    ? "border-blue-600 bg-blue-50 shadow-sm"
                                                    : "border-gray-200 bg-white hover:border-gray-300"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "font-medium",
                                                    hearAbout === option.id ? "text-blue-600" : "text-gray-900"
                                                )}>
                                                    {option.label}
                                                </span>
                                                {hearAbout === option.id && (
                                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleBack}
                                        variant="outline"
                                        className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700 h-12 text-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={!hearAbout}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500 h-12 text-lg"
                                    >
                                        Complete Setup
                                        <CheckCircle className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            </FieldGroup>
                        )}
                    </CardContent>
                </Card>

                {/* Skip Option */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="text-gray-500 hover:text-gray-700 text-sm underline underline-offset-2"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;
