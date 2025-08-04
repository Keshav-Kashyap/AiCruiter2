"use client"

import React, { useState } from 'react';
import { Check, Zap, Users, Star, Crown, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import UserStatus from './_components/UserStatus';
import CardContainer from './_components/CardContainer';

const BillingComponent = () => {




    const plans = [
        {
            id: 'basic',
            name: 'Basic Plan',
            price: 12,
            icon: <Zap className="w-6 h-6" />,
            color: 'blue',
            features: [
                '50 AI Interview Credits',
                'Basic Interview Templates',
                'Email Support',
                'Standard Question Bank',
                'Basic Analytics'
            ],
            popular: false
        },
        {
            id: 'professional',
            name: 'Professional Plan',
            price: 15,
            icon: <Users className="w-6 h-6" />,
            color: 'green',
            features: [
                '150 AI Interview Credits',
                'Advanced Interview Templates',
                'Priority Support',
                'Custom Question Bank',
                'Advanced Analytics',
                'Video Recording Feature'
            ],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise Plan',
            price: 30,
            icon: <Crown className="w-6 h-6" />,
            color: 'red',
            features: [
                'Unlimited AI Interview Credits',
                'Premium Templates & Customization',
                '24/7 Dedicated Support',
                'AI-Powered Question Generation',
                'Comprehensive Analytics Dashboard',
                'Multi-format Export',
                'Team Collaboration Tools',
                'White-label Solution'
            ],
            popular: false
        }
    ];

    const getColorClasses = (color, type = 'border') => {
        const colorMap = {
            blue: {
                border: 'border-blue-500',
                bg: 'bg-blue-500',
                bgLight: 'bg-blue-50',
                text: 'text-blue-600',
                hover: 'hover:bg-blue-600'
            },
            green: {
                border: 'border-green-500',
                bg: 'bg-green-500',
                bgLight: 'bg-green-50',
                text: 'text-green-600',
                hover: 'hover:bg-green-600'
            },
            red: {
                border: 'border-red-500',
                bg: 'bg-red-500',
                bgLight: 'bg-red-50',
                text: 'text-red-600',
                hover: 'hover:bg-red-600'
            }
        };
        return colorMap[color][type];
    };

    return (
        <div className="max-w-7xl mx-auto p-6  min-h-screen mt-5">
            {/* Header */}
            <div className=" mb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Billing
                </h1>
                <p className="text-xl text-gray-600">
                    Choose the perfect plan for your interview needs
                </p>
            </div>

            {/* Current Status Container */}
            <UserStatus />

            {/* Plans Section */}
            <CardContainer />

            {/* Purchase Confirmation */}

        </div>
    );
};

export default BillingComponent;