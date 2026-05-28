"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supaBaseClient';
import { useAuthValidation, useAuthTimer } from '../_components/useAuthValidation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { ArrowLeft, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Loading from '@/components/Loading';
import { cn } from '@/lib/utils';
import BackgroundLayout from '../_components/BackGroundLayout';

const Login = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState('input'); 
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        userName: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [existingUser, setExistingUser] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { validateEmail, validatePassword } = useAuthValidation();
    const { timer, setTimer } = useAuthTimer();

    const review = {
        name: 'Aarav Mehta',
        role: 'Product Designer, QRA',
        company: 'QRA',
        quote: 'QRA keeps interview prep simple. The platform gives me realistic interview questions, quick feedback, and a clear place to improve every session.',
    };

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
        setFormData(prev => {
            const nextFormData = { ...prev, [field]: value };

            if (field === 'password' || field === 'confirmPassword') {
                const password = field === 'password' ? value : nextFormData.password;
                const confirmPassword = field === 'confirmPassword' ? value : nextFormData.confirmPassword;

                setErrors(prevErrors => {
                    const nextErrors = { ...prevErrors };

                    if (nextErrors.confirmPassword) {
                        delete nextErrors.confirmPassword;
                    }

                    if (password && confirmPassword && password !== confirmPassword) {
                        nextErrors.confirmPassword = 'Password do not match';
                    }

                    return nextErrors;
                });
            }

            return nextFormData;
        });

        if (field !== 'password' && field !== 'confirmPassword') {
            clearErrors(field);
        }
    };

	//OAth Login
    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            console.log('Signing in with Google...');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
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
                setExistingUser(Boolean(data.existingUser));
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
	//verify-otp funx
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
                setCurrentStep('userdetails');
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

        if (!formData.password) {
            setErrors({ password: 'Password is required' });
            return;
        }

        if (!validatePassword(formData.password)) {
            setErrors({ password: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' });
            return;
        }

        if (!formData.confirmPassword) {
            setErrors({ confirmPassword: 'Please confirm your password' });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch('/api/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.userName.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.error || 'Failed to create account. Please try again.' });
                return;
            }

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) {
                setErrors({ general: signInError.message || 'Account created, but login failed. Please try again.' });
                return;
            }

                router.replace('/dashboard');
        } catch (error) {
            console.error('Error saving user details:', error);
            setErrors({ general: error?.message || 'Something went wrong while creating the account. Please try again.' });
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
            setFormData(prev => ({
                ...prev,
                userName: '',
                password: '',
                confirmPassword: ''
            }));
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
            default:
                return 'Sign in';
        }
    };

    const getStepDescription = () => {
        switch (currentStep) {
            case 'input':
                return 'Create your QRA account to start interview practice';
            case 'otp':
                return `We've sent a 6-digit code to ${formData.email}`;
            case 'userdetails':
                return 'Please tell us your name to complete setup';
            default:
                return '';
        }
    };

    return (
        <BackgroundLayout>
            <div className="w-full max-w-6xl">
                <Card className="overflow-hidden p-0 border border-white/10 bg-[#0f1218] shadow-[0_24px_70px_rgba(0,0,0,0.35)] mb-5">
                    <CardContent className="grid p-0 md:grid-cols-2 bg-transparent">
                        <div className="relative p-6 md:p-8 bg-[#0f1218]">
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <FieldGroup>
                                <div className="mb-8 flex items-center justify-center md:justify-start">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-gray-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                                        Secure sign in
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
                                    <h1 className="text-3xl font-semibold tracking-tight text-white md:text-[2.15rem]">{getStepTitle()}</h1>
                                    <p className="max-w-md text-sm leading-6 text-gray-400 md:text-[15px]">
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

                                {/* Login Form */}
                                {currentStep === 'input' && (
                                    <>
                                        <Field>
                                            <FieldLabel htmlFor="email" className="text-gray-200 font-medium">Email</FieldLabel>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="aman@example.com"
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

                                        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#0f1218] text-gray-400">
                                            Or continue with
                                        </FieldSeparator>

                                        <Field>
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={signInWithGoogle}
                                                disabled={isLoading}
                                                className="flex h-11 w-full items-center justify-center gap-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                                                    <path
                                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <span>Continue with Google</span>
                                            </Button>
                                        </Field>

                                        <FieldDescription className="text-center text-gray-300">
                                            Already have an account? <a href="/auth/login" className="text-blue-400 hover:underline">Log in</a>
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
                                                    className="text-white caret-white"
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} className="border-white/15 bg-white/5 text-white" />
                                                        <InputOTPSlot index={1} className="border-white/15 bg-white/5 text-white" />
                                                        <InputOTPSlot index={2} className="border-white/15 bg-white/5 text-white" />
                                                        <InputOTPSlot index={3} className="border-white/15 bg-white/5 text-white" />
                                                        <InputOTPSlot index={4} className="border-white/15 bg-white/5 text-white" />
                                                        <InputOTPSlot index={5} className="border-white/15 bg-white/5 text-white" />
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
                                            <FieldLabel htmlFor="password" className="text-gray-200 font-medium">Password</FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                                    disabled={isLoading}
                                                    maxLength={50}
                                                    autoComplete="new-password"
                                                    className="border-white/15 bg-white/5 pr-10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowPassword(prev => !prev)}
                                                    disabled={isLoading}
                                                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-white/5 hover:text-white"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                                            )}
                                        </Field>
										
                                        <Field>
                                            <FieldLabel htmlFor="confirmPassword" className="text-gray-200 font-medium">Confirm Password</FieldLabel>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Confirm password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                    disabled={isLoading}
                                                    maxLength={50}
                                                    autoComplete="new-password"
                                                    className="border-white/15 bg-white/5 pr-10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                                    disabled={isLoading}
                                                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-400 hover:bg-white/5 hover:text-white"
                                                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
                                            )}
                                        </Field>

                                        <Field>
                                            <Button
                                                onClick={handleUserDetailsSubmit}
                                                disabled={isLoading || !formData.userName.trim() || formData.userName.trim().length < 2 || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
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

                        <div className="relative hidden items-center justify-center overflow-hidden border-l border-white/10 bg-[#0d1016] p-8 md:flex">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_55%)]" />

                            <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-[#11151c] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.32)] transition-all duration-700">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-gray-500">
                                        Customer note
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {review.company}
                                    </div>
                                </div>

                                <div className="mt-6 text-[56px] leading-none text-white/10">“</div>

                                <p className="-mt-3 font-serif text-[20px] leading-[1.65] tracking-[-0.01em] text-white/90 md:text-[21px]">
                                    {review.quote}
                                </p>

                                <div className="mt-7 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{review.name}</p>
                                        <p className="text-xs text-gray-400">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <FieldDescription className="px-6 text-center text-gray-500 ">
                    By clicking continue, you agree to our <a href="#" className="text-gray-300 hover:text-white hover:underline">Terms of Service</a>{" "}
                    and <a href="#" className="text-gray-300 hover:text-white hover:underline">Privacy Policy</a>.
                </FieldDescription>
            </div>
        </BackgroundLayout>
    );
};

export default Login;