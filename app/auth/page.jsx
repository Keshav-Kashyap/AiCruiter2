"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supaBaseClient';
import { useUser } from '@/app/provider';
import BackgroundLayout from './_components/BackGroundLayout';
import { useAuthValidation, useAuthTimer } from './_components/useAuthValidation';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';
import Loading from '@/components/Loading';

const Login = () => {
    const [currentStep, setCurrentStep] = useState('input'); // input, otp, userdetails, success
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        userName: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const { user, loading, updateUserName, refreshUser } = useUser();
    const { validateEmail } = useAuthValidation();
    const { timer, setTimer } = useAuthTimer();

    // Check if user is already logged in and has complete profile
    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session && !loading) {
                if (user && user.name && user.name.trim()) {
                    window.location.href = '/dashboard';
                } else if (user && (!user.name || !user.name.trim())) {
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

    // Send OTP via API
    const sendOTP = async () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsLoading(true);
        setSuccess('');
        setErrors({});

        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                setSuccess('OTP sent successfully to your email!');
                setCurrentStep('otp');
                setTimer(60);
                console.log('OTP sent to:', formData.email);
            } else {
                setErrors({ general: data.error || 'Failed to send OTP. Please try again.' });
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
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
            // Verify OTP via API
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Email verified successfully!');

                // Create Supabase auth session
                try {
                    // Try to sign in first
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
                        email: formData.email,
                        options: { shouldCreateUser: false }, // don't auto create
                    });

                    if (signInError) {
                        // Agar sign in failed and error bolta hai "user not found"
                        if (signInError.message.includes("not found") || signInError.message.includes("No user")) {
                            // Tab create new user
                            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                                email: formData.email,
                                password: `temp_password_${Date.now()}_${Math.random()}`,
                            });

                            if (signUpError) {
                                console.error("SignUp error:", signUpError);
                                setErrors({ otp: "Failed to create session. Please try again." });
                                setIsLoading(false);
                                return;
                            }
                        } else {
                            console.error("SignIn error:", signInError);
                            setErrors({ otp: "Login failed. Please try again." });
                            setIsLoading(false);
                            return;
                        }
                    }

                    // Wait for auth to complete and refresh user data
                    setTimeout(async () => {
                        try {
                            await refreshUser();

                            // Additional wait to ensure user state is properly updated
                            setTimeout(async () => {
                                // Get fresh user data directly from database instead of relying on context state
                                const { data: { user: authUser } } = await supabase.auth.getUser();

                                if (authUser) {
                                    // Check user in database
                                    let { data: dbUser, error: dbError } = await supabase
                                        .from('Users')
                                        .select("*")
                                        .eq('email', authUser.email)
                                        .single();

                                    if (dbError) {
                                        console.error('Error fetching user from DB:', dbError);
                                        setCurrentStep("userdetails");
                                        return;
                                    }

                                    if (dbUser && dbUser.name && dbUser.name.trim()) {
                                        // User has name, go to dashboard
                                        setCurrentStep("success");
                                        setTimeout(() => {
                                            window.location.href = "/dashboard";
                                        }, 1000);
                                    } else {
                                        // User exists but no name, go to user details
                                        setCurrentStep("userdetails");
                                    }
                                } else {
                                    // No auth user, go to user details as fallback
                                    setCurrentStep("userdetails");
                                }
                            }, 1000);
                        } catch (error) {
                            console.error('Error in user refresh:', error);
                            setCurrentStep("userdetails");
                        }
                    }, 1500);

                } catch (authError) {
                    console.error("Auth error:", authError);
                    setErrors({ otp: "Failed to authenticate. Please try again." });
                }
            } else {
                setErrors({ otp: data.error || 'Invalid OTP. Please try again.' });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrors({ otp: 'Network error. Please check your connection and try again.' });
        }

        setIsLoading(false);
    };

    const handleUserDetailsSubmit = async () => {
        if (!formData.userName.trim()) {
            setErrors({ userName: 'Please enter your name' });
            return;
        }

        // Basic name validation
        if (formData.userName.trim().length < 2) {
            setErrors({ userName: 'Name must be at least 2 characters long' });
            return;
        }

        if (formData.userName.trim().length > 50) {
            setErrors({ userName: 'Name must be less than 50 characters' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const success = await updateUserName(formData.userName.trim());

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

    const resendOTP = async () => {
        setFormData(prev => ({ ...prev, otp: '' }));
        setErrors({});
        setSuccess('');
        setTimer(0);

        // Send new OTP
        await sendOTP();
    };

    const goBack = () => {
        if (currentStep === 'otp') {
            setCurrentStep('input');
            setFormData(prev => ({ ...prev, otp: '' }));
            setTimer(0);
            setOtpSent(false);
        } else if (currentStep === 'userdetails') {
            setCurrentStep('input');
            setFormData(prev => ({ ...prev, userName: '' }));
        }
        setErrors({});
        setSuccess('');
    };

    const handleOtpChange = (value) => {
        // Only allow numeric values and limit to 6 digits
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        handleInputChange('otp', numericValue);
    };

    // Show loading while checking auth status
    if (loading) {
        return (
            <Loading loadingMessage={'Please Wait'} loadingDescription={'Data Fetching...'} />
        );
    }

    const getStepTitle = () => {
        switch (currentStep) {
            case 'input':
                return 'Welcome back';
            case 'otp':
                return 'Verify your email';
            case 'userdetails':
                return 'Complete your profile';
            case 'success':
                return 'Welcome!';
            default:
                return 'Sign in';
        }
    };

    const getStepDescription = () => {
        switch (currentStep) {
            case 'input':
                return 'Sign in to your account to continue';
            case 'otp':
                return `We've sent a 6-digit code to ${formData.email}`;
            case 'userdetails':
                return 'Please tell us your name to complete setup';
            case 'success':
                return 'Your account has been set up successfully!';
            default:
                return '';
        }
    };

    return (
        <BackgroundLayout>
            <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                <Card className="w-full bg-black/20 backdrop-blur-sm border-white/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-white text-2xl font-bold">
                            {getStepTitle()}
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            {getStepDescription()}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Success/Error Messages */}
                        {success && (
                            <Alert className="bg-green-500/20 border-green-500/50 text-green-100">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {(errors.general || errors.google) && (
                            <Alert className="bg-red-500/20 border-red-500/50 text-red-100">
                                <AlertDescription>
                                    {errors.general || errors.google}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Success View */}
                        {currentStep === 'success' && (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                <p className="text-white text-lg">Redirecting to dashboard...</p>
                            </div>
                        )}

                        {/* Login Form */}
                        {currentStep === 'input' && (

                            <div className="space-y-4">


                                <Button
                                    onClick={signInWithGoogle}
                                    disabled={isLoading}
                                    variant="outline"
                                    className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/20" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">

                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value.toLowerCase().trim())}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                                        disabled={isLoading}
                                        maxLength={254} // Standard email max length
                                        autoComplete="email"
                                    />
                                    {errors.email && (
                                        <p className="text-red-400 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                <Button
                                    onClick={sendOTP}
                                    disabled={isLoading || !formData.email}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Send OTP
                                        </>
                                    )}
                                </Button>




                            </div>
                        )}

                        {/* OTP Form */}
                        {currentStep === 'otp' && (
                            <div className="space-y-6">
                                <Button
                                    onClick={goBack}
                                    variant="ghost"
                                    className="text-white hover:bg-white/10 p-0"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>

                                <div className="space-y-4">
                                    <Label className="text-white block text-center">
                                        Enter 6-digit code
                                    </Label>

                                    <div className="flex justify-center">
                                        <InputOTP
                                            value={formData.otp}
                                            onChange={handleOtpChange}
                                            maxLength={6}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} className="bg-white/10 border-white/20 text-white" />
                                                <InputOTPSlot index={1} className="bg-white/10 border-white/20 text-white" />
                                                <InputOTPSlot index={2} className="bg-white/10 border-white/20 text-white" />
                                                <InputOTPSlot index={3} className="bg-white/10 border-white/20 text-white" />
                                                <InputOTPSlot index={4} className="bg-white/10 border-white/20 text-white" />
                                                <InputOTPSlot index={5} className="bg-white/10 border-white/20 text-white" />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>

                                    {errors.otp && (
                                        <p className="text-red-400 text-sm text-center">{errors.otp}</p>
                                    )}

                                    <Button
                                        onClick={verifyOTP}
                                        disabled={isLoading || formData.otp.length !== 6}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            'Verify Code'
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        {timer > 0 ? (
                                            <p className="text-gray-400 text-sm">
                                                Resend code in {timer}s
                                            </p>
                                        ) : (
                                            <Button
                                                onClick={resendOTP}
                                                variant="ghost"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-white/10"
                                                disabled={isLoading}
                                            >
                                                Resend Code
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* User Details Form */}
                        {currentStep === 'userdetails' && (
                            <div className="space-y-6">
                                <Button
                                    onClick={goBack}
                                    variant="ghost"
                                    className="text-white hover:bg-white/10 p-0"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="userName" className="text-white">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="userName"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.userName}
                                            onChange={(e) => handleInputChange('userName', e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400"
                                            disabled={isLoading}
                                            maxLength={50}
                                            autoComplete="name"
                                        />
                                        {errors.userName && (
                                            <p className="text-red-400 text-sm">{errors.userName}</p>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleUserDetailsSubmit}
                                        disabled={isLoading || !formData.userName.trim() || formData.userName.trim().length < 2}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Complete Setup'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </BackgroundLayout>
    );
};

export default Login;