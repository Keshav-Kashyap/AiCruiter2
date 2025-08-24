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
            color: 'purple',
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
                border: 'border-blue-500 dark:border-blue-400',
                bg: 'bg-blue-500 dark:bg-blue-600',
                bgLight: 'bg-blue-50 dark:bg-blue-900/20',
                text: 'text-blue-600 dark:text-blue-400',
                hover: 'hover:bg-blue-600 dark:hover:bg-blue-500',
                ring: 'ring-blue-500 dark:ring-blue-400'
            },
            green: {
                border: 'border-green-500 dark:border-green-400',
                bg: 'bg-green-500 dark:bg-green-600',
                bgLight: 'bg-green-50 dark:bg-green-900/20',
                text: 'text-green-600 dark:text-green-400',
                hover: 'hover:bg-green-600 dark:hover:bg-green-500',
                ring: 'ring-green-500 dark:ring-green-400'
            },
            purple: {
                border: 'border-purple-500 dark:border-purple-400',
                bg: 'bg-purple-500 dark:bg-purple-600',
                bgLight: 'bg-purple-50 dark:bg-purple-900/20',
                text: 'text-purple-600 dark:text-purple-400',
                hover: 'hover:bg-purple-600 dark:hover:bg-purple-500',
                ring: 'ring-purple-500 dark:ring-purple-400'
            }
        };
        return colorMap[color][type];
    };

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen mt-5 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300">
            {/* Header */}
            <div className="mb-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Billing & Plans
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Choose the perfect plan for your interview needs
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
                </div>
            </div>

            {/* Current Status Container */}
            <UserStatus />

            {/* Plans Section */}
            <CardContainer plans={plans} getColorClasses={getColorClasses} />
        </div>
    );
};

export default BillingComponent;