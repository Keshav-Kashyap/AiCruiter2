"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supaBaseClient';
import { useUser } from '@/app/provider';
import BackgroundLayout from './_components/BackgroundLayout';
import AuthCard from './_components/AuthCard';
import MessageDisplay from './_components/MessageDisplay';
import AuthHeader from './_components/AuthHeader';
import LoginForm from './_components/LoginForm';
import OTPForm from './_components/OTPForm';
import UserDetails from './_components/UserDetails';
import { useAuthValidation, useAuthTimer } from './_components/useAuthValidation';
import SuccessView from './_components/SuccessView';

const Login = () => {
    const [activeTab, setActiveTab] = useState('email'); // email or phone
    const [currentStep, setCurrentStep] = useState('input'); // input, otp, userdetails, success
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        otp: '',
        userName: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const { user, loading, updateUserName } = useUser();
    const { validateEmail, validatePhone } = useAuthValidation();
    const { timer, setTimer } = useAuthTimer();

    // Check if user is already logged in and has complete profile
    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session && !loading) {
                // User is logged in, check if they have a name
                if (user && user.name && user.name.trim()) {
                    // User has complete profile, redirect to dashboard
                    window.location.href = '/dashboard';
                } else if (user && (!user.name || !user.name.trim())) {
                    // User exists but no name, show userdetails step
                    setCurrentStep('userdetails');
                }
            }
        };

        if (!loading) {
            checkAuthStatus();
        }
    }, [user, loading]);

    const clearErrors = (field = null) => {
        if (field) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        } else {
            setErrors({});
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearErrors(field);
    };

    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            console.log('Signing in with Google...');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://ai-cruiter2.vercel.app/dashboard'
                }
            });
            if (error) {
                console.log("error msg", error.message);
                setErrors({ google: error.message });
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            setErrors({ google: 'Failed to sign in with Google' });
        }
        setIsLoading(false);
    };

    const sendOTP = async () => {
        const newErrors = {};

        if (activeTab === 'email' && !formData.email) {
            newErrors.email = 'Email is required';
        } else if (activeTab === 'email' && !validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (activeTab === 'phone' && !formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (activeTab === 'phone' && !validatePhone(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit mobile number';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        setSuccess('');
        setErrors({});

        try {
            let result;

            if (activeTab === 'email') {
                result = await supabase.auth.signInWithOtp({
                    email: formData.email,
                    options: { shouldCreateUser: true }
                });
                console.log("Email OTP result:", result);
            } else {
                const fullPhoneNumber = `+91${formData.phone}`;
                result = await supabase.auth.signInWithOtp({
                    phone: fullPhoneNumber,
                    options: { shouldCreateUser: true }
                });
                console.log("Phone OTP result:", result);
            }

            if (result.error) {
                console.error('Error sending OTP:', result.error);
                setErrors({ general: result.error.message || 'Failed to send OTP. Please try again.' });
            } else {
                setOtpSent(true);
                setSuccess(`OTP sent successfully to your ${activeTab}!`);
                setCurrentStep('otp');
                setTimer(60);
                console.log(`OTP sent to ${activeTab}:`, activeTab === 'email' ? formData.email : formData.phone);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrors({ general: 'Something went wrong. Please try again.' });
        }

        setIsLoading(false);
    };

    const verifyOTP = async () => {
        if (!formData.otp || formData.otp.length !== 6) {
            setErrors({ otp: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            let result;

            if (activeTab === 'email') {
                result = await supabase.auth.verifyOtp({
                    email: formData.email,
                    token: formData.otp,
                    type: 'email'
                });
            } else {
                const fullPhoneNumber = `+91${formData.phone}`;
                result = await supabase.auth.verifyOtp({
                    phone: fullPhoneNumber,
                    token: formData.otp,
                    type: 'sms'
                });
            }

            console.log("OTP verification result:", result);

            if (result.error) {
                console.error('OTP verification error:', result.error);
                setErrors({ otp: result.error.message || 'Invalid OTP or expired. Please try again.' });
            } else {
                setSuccess(`${activeTab === 'email' ? 'Email' : 'Phone'} verified successfully!`);
                console.log("Session:", result.data.session);
                console.log("User:", result.data.user);

                // Wait a moment for the provider to update user data
                setTimeout(() => {
                    // Provider will handle checking if user needs to provide name
                    // If name exists, will redirect to dashboard
                    // If no name, will show userdetails step
                }, 1000);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrors({ otp: 'Something went wrong. Please try again.' });
        }

        setIsLoading(false);
    };

    const handleUserDetailsSubmit = async () => {
        if (!formData.userName.trim()) {
            setErrors({ userName: 'Please enter your name' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // Update user name using the provider function
            const success = await updateUserName(formData.userName);

            if (success) {
                setSuccess('Profile updated successfully!');
                setCurrentStep('success');

                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                setErrors({ userName: 'Failed to save user details. Please try again.' });
            }
        } catch (error) {
            console.error('Error saving user details:', error);
            setErrors({ userName: 'Something went wrong. Please try again.' });
        }

        setIsLoading(false);
    };

    const resendOTP = () => {
        setFormData(prev => ({ ...prev, otp: '' }));
        setErrors({});
        setSuccess('');
        sendOTP();
    };

    const goBack = () => {
        if (currentStep === 'otp') {
            setCurrentStep('input');
            setFormData(prev => ({ ...prev, otp: '' }));
            setTimer(0);
            setOtpSent(false);
        } else if (currentStep === 'userdetails') {
            setCurrentStep('otp');
            setFormData(prev => ({ ...prev, userName: '' }));
        }
        setErrors({});
        setSuccess('');
    };

    const handleOtpChange = (value) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        handleInputChange('otp', numericValue);
    };

    // Show loading while checking auth status
    if (loading) {
        return (
            <BackgroundLayout>
                <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                    <AuthCard>
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                            <span className="ml-3 text-white">Loading...</span>
                        </div>
                    </AuthCard>
                </div>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                <AuthCard>
                    <MessageDisplay
                        success={success}
                        errors={errors}
                    />

                    <AuthHeader
                        currentStep={currentStep}
                        activeTab={activeTab}
                    />

                    {currentStep === 'success' && (
                        <SuccessView />
                    )}

                    {currentStep === 'input' && (
                        <LoginForm
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            handleInputChange={handleInputChange}
                            signInWithGoogle={signInWithGoogle}
                            sendOTP={sendOTP}
                        />
                    )}

                    {currentStep === 'otp' && (
                        <OTPForm
                            activeTab={activeTab}
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            timer={timer}
                            handleOtpChange={handleOtpChange}
                            verifyOTP={verifyOTP}
                            resendOTP={resendOTP}
                            goBack={goBack}
                        />
                    )}

                    {currentStep === 'userdetails' && (
                        <UserDetails
                            formData={formData}
                            errors={errors}
                            isLoading={isLoading}
                            handleInputChange={handleInputChange}
                            handleUserDetailsSubmit={handleUserDetailsSubmit}
                            goBack={goBack}
                        />
                    )}
                </AuthCard>
            </div>
        </BackgroundLayout>
    );
};

export default Login;