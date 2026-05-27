"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supaBaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field';
import { Loader2 } from 'lucide-react';
import BackgroundLayout from '../_components/BackGroundLayout';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const review = {
        name: 'Aarav Mehta',
        role: 'Product Designer, QRA',
        company: 'QRA',
        quote: 'QRA makes interview practice feel focused and real. The AI questions, feedback, and resume-based prompts help me prepare faster every day.',
    };

    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                router.replace('/dashboard');
            }
        };

        checkAuthStatus();
    }, [router]);

    const clearError = (field) => {
        setErrors(prev => {
            if (!prev[field]) {
                return prev;
            }

            const nextErrors = { ...prev };
            delete nextErrors[field];
            return nextErrors;
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearError(field);
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        const nextErrors = {};

        if (!formData.email.trim()) {
            nextErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            nextErrors.password = 'Password is required';
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                setErrors({ general: error.message || 'Failed to log in. Please try again.' });
                return;
            }

            router.replace('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ general: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            });

            if (error) {
                setErrors({ google: error.message });
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            setErrors({ google: 'Failed to sign in with Google' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BackgroundLayout>
            <div className="w-full max-w-6xl">
                <Card className="overflow-hidden p-0 border border-white/10 bg-[#0f1218] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
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

                                <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
                                    <h1 className="text-3xl font-semibold tracking-tight text-white md:text-[2.15rem]">Welcome back</h1>
                                    <p className="max-w-md text-sm leading-6 text-gray-400 md:text-[15px]">
                                        Login with your email and password to continue.
                                    </p>
                                </div>

                                {(errors.general || errors.google) && (
                                    <Alert className="border-red-500/20 bg-red-500/10 text-red-100">
                                        <AlertDescription className="text-red-100">
                                            {errors.general || errors.google}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleLogin} className="space-y-5">
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-gray-200 font-medium">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value.toLowerCase().trim())}
                                            disabled={isLoading}
                                            required
                                            autoComplete="email"
                                            className="border-white/15 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-300">{errors.email}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="password" className="text-gray-200 font-medium">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            disabled={isLoading}
                                            required
                                            autoComplete="current-password"
                                            className="border-white/15 bg-white/5 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-300">{errors.password}</p>
                                        )}
                                    </Field>

                                    <Field>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !formData.email || !formData.password}
                                            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-white/10 disabled:text-gray-500"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Logging in...
                                                </>
                                            ) : (
                                                'Login'
                                            )}
                                        </Button>
                                    </Field>

                                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-[#050816] text-gray-400">
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
                                        Don&apos;t have an account? <a href="/auth/signup" className="text-blue-400 hover:underline">Sign up</a>
                                    </FieldDescription>
                                </form>
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

                <FieldDescription className="px-6 text-center text-gray-500">
                    By logging in, you agree to our <a href="#" className="text-gray-300 hover:text-white hover:underline">Terms of Service</a>{" "}
                    and <a href="#" className="text-gray-300 hover:text-white hover:underline">Privacy Policy</a>.
                </FieldDescription>
            </div>
        </BackgroundLayout>
    );
};

export default Login;