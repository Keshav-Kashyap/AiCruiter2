import { defaultEasing } from 'framer-motion';
import React from 'react'

export const sendOTP = async () => {
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
            // Email OTP
            result = await supabase.auth.signInWithOtp({
                email: formData.email,
                options: {
                    shouldCreateUser: true,
                }
            });
            console.log("Email OTP result:", result);
        } else {
            // Phone OTP
            const fullPhoneNumber = `+91${formData.phone}`;
            result = await supabase.auth.signInWithOtp({
                phone: fullPhoneNumber,
                options: {
                    shouldCreateUser: true,
                }
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