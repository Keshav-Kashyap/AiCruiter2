import React from 'react';
import { Check, Shield } from 'lucide-react';

const AuthHeader = ({ currentStep, activeTab }) => {
    const getHeaderContent = () => {
        switch (currentStep) {
            case 'success':
                return {
                    icon: <Check className="w-6 h-6 md:w-8 md:h-8 text-white" />,
                    title: 'Welcome to QRA!',
                    subtitle: 'Login successful! Redirecting...'
                };
            case 'otp':
                return {
                    icon: <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />,
                    title: 'Verify OTP',
                    subtitle: `Enter the 6-digit code sent to your ${activeTab}`
                };
            default:
                return {
                    icon: <img src="/logo2.png" alt="Logo" />,
                    title: 'Welcome to QRA',
                    subtitle: 'Sign In With Google or Email/Phone'
                };
        }
    };

    const { icon, title, subtitle } = getHeaderContent();

    return (
        <div className="text-center mb-6 w-full">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                {icon}
            </div>

            <h2 className='text-xl md:text-2xl font-bold text-white text-center mb-2'>
                {title}
            </h2>

            <p className='text-gray-400 text-center text-sm'>
                {subtitle}
            </p>
        </div>
    );
};

export default AuthHeader;