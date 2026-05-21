"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/services/supaBaseClient';
import { useUser } from '@/app/provider';
import { useAuthValidation, useAuthTimer } from './_components/useAuthValidation';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { ArrowLeft, Mail, CheckCircle, Loader2 } from 'lucide-react';
import Loading from '@/components/Loading';
import { cn } from '@/lib/utils';
import BackgroundLayout from './_components/BackGroundLayout';

const Login = () => {
    const [currentStep, setCurrentStep] = useState('input'); // input, otp, userdetails, success
    const [reviewIndex, setReviewIndex] = useState(0);
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

    const reviews = [
        {
            name: 'Aarav Mehta',
            role: 'Frontend Developer',
            company: 'StackWave',
            quote: 'The interview flow felt calm and professional. I liked how clear the questions were and how fast the feedback came through.',
        },
        {
            name: 'Sneha Kapoor',
            role: 'Product Designer',
            company: 'Northstar Labs',
            quote: 'The whole experience looked premium and modern. It made the platform feel trustworthy from the first minute.',
        },
        {
            name: 'Karan Shah',
            role: 'Backend Engineer',
            company: 'CloudMint',
            quote: 'Clean UI, smooth flow, and a solid interview experience. It honestly feels like a next-gen hiring product.',
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setReviewIndex((prev) => (prev + 1) % reviews.length);
        }, 4500);

        return () => clearInterval(interval);
    }, [reviews.length]);

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
    // if (loading) {
    //     return (
    //         <Loading loadingMessage={'Please Wait'} loadingDescription={'Data Fetching...'} />
    //     );
    // }

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
                return 'Login to your AICruiter account';
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
            <div className="w-full max-w-6xl">
                <Card className="overflow-hidden p-0 border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                    <CardContent className="grid p-0 md:grid-cols-2 bg-transparent">
                        <div className="p-6 md:p-8 bg-transparent">
                            <FieldGroup>
                                {/* Header */}
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <h1 className="text-2xl font-bold text-white">{getStepTitle()}</h1>
                                    <p className="text-balance text-gray-300">
                                        {getStepDescription()}
                                    </p>
                                </div>

                                {/* Success/Error Messages */}
                                {success && (
                                    <Alert className="border-emerald-500/20 bg-emerald-500/10 text-emerald-100">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-emerald-100">{success}</AlertDescription>
                                    </Alert>
                                )}

                                {(errors.general || errors.google) && (
                                    <Alert className="border-red-500/20 bg-red-500/10 text-red-100">
                                        <AlertDescription className="text-red-100">
                                            {errors.general || errors.google}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Success View */}
                                {currentStep === 'success' && (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <p className="text-lg text-white">Redirecting to dashboard...</p>
                                    </div>
                                )}

                                {/* Login Form */}
                                {currentStep === 'input' && (
                                    <>
                                        <Field>
                                            <FieldLabel htmlFor="email" className="text-gray-200 font-medium">Email</FieldLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value.toLowerCase().trim())}
                                                disabled={isLoading}
                                                required
                                                className="border-white/15 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.email && (
                                                <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <Button
                                                onClick={sendOTP}
                                                disabled={isLoading || !formData.email}
                                                type="button"
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-white/10 disabled:text-gray-500"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    'Login'
                                                )}
                                            </Button>
                                        </Field>

                                        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#050816] text-gray-400">
                                            Or continue with
                                        </FieldSeparator>

                                        <Field className="grid grid-cols-3 gap-4">
                                            <Button variant="outline" type="button" className="border-gray-300 hover:bg-gray-50 text-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                                        fill="currentColor" />
                                                </svg>
                                                <span className="sr-only">Login with Apple</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={signInWithGoogle}
                                                disabled={isLoading}
                                                className="border-gray-300 hover:bg-gray-50 text-gray-700"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path
                                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                        fill="currentColor" />
                                                </svg>
                                                <span className="sr-only">Login with Google</span>
                                            </Button>
                                            <Button variant="outline" type="button" className="border-gray-300 hover:bg-gray-50 text-gray-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                    <path
                                                        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                                                        fill="currentColor" />
                                                </svg>
                                                <span className="sr-only">Login with Meta</span>
                                            </Button>
                                        </Field>

                                        <FieldDescription className="text-center text-gray-300">
                                            Don&apos;t have an account? <a href="#" className="text-blue-400 hover:underline">Sign up</a>
                                        </FieldDescription>
                                    </>
                                )}

                                {/* OTP Form */}
                                {currentStep === 'otp' && (
                                    <>
                                        <Button
                                            onClick={goBack}
                                            variant="ghost"
                                            className="self-start p-0 h-auto text-gray-300 hover:text-white"
                                            type="button"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back to email
                                        </Button>

                                        <Field>
                                            <FieldLabel className="text-center block text-gray-200 font-medium">Enter 6-digit code</FieldLabel>
                                            <div className="flex justify-center">
                                                <InputOTP
                                                    value={formData.otp}
                                                    onChange={handleOtpChange}
                                                    maxLength={6}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                            {errors.otp && (
                                                <p className="text-red-300 text-sm text-center mt-1">{errors.otp}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <Button
                                                onClick={verifyOTP}
                                                disabled={isLoading || formData.otp.length !== 6}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-white/10 disabled:text-gray-500"
                                                type="button"
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
                                        </Field>

                                        <FieldDescription className="text-center text-gray-600">
                                            {timer > 0 ? (
                                                <span className="text-gray-300">Resend code in {timer}s</span>
                                            ) : (
                                                <Button
                                                    onClick={resendOTP}
                                                    variant="link"
                                                    className="p-0 h-auto text-blue-400 hover:underline"
                                                    disabled={isLoading}
                                                    type="button"
                                                >
                                                    Resend Code
                                                </Button>
                                            )}
                                        </FieldDescription>
                                    </>
                                )}

                                {/* User Details Form */}
                                {currentStep === 'userdetails' && (
                                    <>
                                        <Button
                                            onClick={goBack}
                                            variant="ghost"
                                            className="self-start p-0 h-auto text-gray-300 hover:text-white"
                                            type="button"
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>

                                        <Field>
                                            <FieldLabel htmlFor="userName" className="text-gray-200 font-medium">Full Name</FieldLabel>
                                            <Input
                                                id="userName"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={formData.userName}
                                                onChange={(e) => handleInputChange('userName', e.target.value)}
                                                disabled={isLoading}
                                                maxLength={50}
                                                autoComplete="name"
                                                className="border-white/15 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.userName && (
                                                <p className="text-red-300 text-sm mt-1">{errors.userName}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <Button
                                                onClick={handleUserDetailsSubmit}
                                                disabled={isLoading || !formData.userName.trim() || formData.userName.trim().length < 2}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
                                                type="button"
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
                                        </Field>
                                    </>
                                )}
                            </FieldGroup>
                        </div>

                        <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#070b1a] via-[#0b1023] to-[#111827] p-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_28%)]" />

                            <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0f17]/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-700">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-sm font-semibold tracking-wide text-white">
                                        {reviews[reviewIndex].company}
                                    </div>
                                    <div className="flex gap-1 text-amber-400 text-xs">
                                        <span>★</span>
                                        <span>★</span>
                                        <span>★</span>
                                        <span>★</span>
                                        <span>★</span>
                                    </div>
                                </div>

                                <p key={reviewIndex} className="mt-5 text-[15px] leading-7 text-gray-300 transition-opacity duration-500">
                                    “{reviews[reviewIndex].quote}”
                                </p>

                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                                        {reviews[reviewIndex].name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{reviews[reviewIndex].name}</p>
                                        <p className="text-xs text-gray-400">{reviews[reviewIndex].role}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2">
                                    {reviews.map((review, index) => (
                                        <span
                                            key={review.name}
                                            onClick={() => setReviewIndex(index)}
                                            className={`h-1.5 flex-1 cursor-pointer rounded-full transition-all duration-300 ${reviewIndex === index ? 'bg-blue-400' : 'bg-white/15 hover:bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <FieldDescription className="px-6 text-center text-gray-400">
                    By clicking continue, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
                    and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </FieldDescription>
            </div>
        </BackgroundLayout>
    );
};

export default Login;