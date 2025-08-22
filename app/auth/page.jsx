"use client"

import React, { useState } from 'react';
import { Mail, Phone, ArrowLeft, Check, Shield } from 'lucide-react';
import { supabase } from '@/services/supaBaseClient';


const BackgroundLines = ({ className, children }) => (
    <div className={className}>
        {children}
    </div>
);

const Login = () => {
    const [activeTab, setActiveTab] = useState('email'); // email or phone
    const [currentStep, setCurrentStep] = useState('input'); // input, otp, success
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        otp: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    // Your original Google sign-in function
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
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
        setIsLoading(false);
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
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

        try {


            const fullPhoneNumber = `+91${formData.phone}`;

            const { error } = await supabase.auth.signInWithOtp({
                phone: fullPhoneNumber
            });

            if (error) {
                console.error('Error sending OTP:', error);
            } else {
                setOtpSent(true);
                setSuccess("OTP sent successfully to your phone!");
                setTimer(60);
            }

            setIsLoading(false);





            console.log("Phone:->", formData.phone);
            console.log("email:->", formData.email);

            setCurrentStep('otp');
            startTimer();
        } catch (error) {
            console.error('Error sending OTP:', error);
        }

        setIsLoading(false);
    };

    const verifyOTP = async () => {
        if (!formData.otp || formData.otp.length !== 6) {
            setErrors({ otp: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setIsLoading(true);


        const fullPhoneNumber = `+91${formData.phone}`;

        const { data, error } = await supabase.auth.verifyOtp({
            phone: fullPhoneNumber,
            token: formData.otp,
            type: 'sms'
        });
        if (error) {
            setErrors("Invalid OTP or expired. Please try again.");
        } else {
            setSuccess("Phone verified successfully!");
            console.log("Session:", data.session);
            console.log("Success");

        }




    };

    const startTimer = () => {
        setTimer(60);
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resendOTP = () => {
        setFormData(prev => ({ ...prev, otp: '' }));
        setErrors({});
        sendOTP();
    };

    const goBack = () => {
        setCurrentStep('input');
        setFormData(prev => ({ ...prev, otp: '' }));
        setErrors({});
        setTimer(0);
    };

    const handleOtpChange = (value) => {
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        handleInputChange('otp', numericValue);
    };

    return (
        <BackgroundLines className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black px-4 py-8">

            {/* Your original floating orbs */}
            <div
                className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"
                style={{
                    animation: 'float1 8s ease-in-out infinite'
                }}
            />

            <div
                className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
                style={{
                    animation: 'float2 10s ease-in-out infinite'
                }}
            />

            <div className='flex flex-col items-center justify-center w-full max-w-md mx-auto'>
                <div className='flex flex-col items-center border border-white/10 rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-lg w-full shadow-2xl'>

                    <div className='flex items-center flex-col w-full'>

                        {/* Header */}
                        <div className="text-center mb-6 w-full">
                            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                {currentStep === 'success' ? (
                                    <Check className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                ) : currentStep === 'otp' ? (
                                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                ) : (
                                    <div>
                                        <img src="/logo2.png" alt="Logo" />
                                    </div>
                                )}
                            </div>

                            <h2 className='text-xl md:text-2xl font-bold text-white text-center mb-2'>
                                {currentStep === 'success' ? 'Welcome to QRA!' :
                                    currentStep === 'otp' ? 'Verify OTP' :
                                        'Welcome to QRA'}
                            </h2>

                            <p className='text-gray-400 text-center text-sm'>
                                {currentStep === 'success' ? 'Login successful! Redirecting...' :
                                    currentStep === 'otp' ? `Enter the 6-digit code sent to your ${activeTab}` :
                                        'Sign In With Google or Email/Phone'}
                            </p>
                        </div>

                        {/* Success Step */}
                        {currentStep === 'success' && (
                            <div className="text-center py-6 md:py-8 w-full">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                                </div>
                                <p className="text-white text-lg font-semibold mb-2">Login Successful!</p>
                                <p className="text-gray-400 text-sm">You will be redirected shortly...</p>
                                <div className="mt-6">
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Input Step */}
                        {currentStep === 'input' && (
                            <>
                                {/* Login Image */}
                                <div className="w-full mb-6 flex justify-center">
                                    <div className="w-full max-w-xs h-32 md:h-40 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-white/10">
                                        <div className="text-white/60 text-center">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl mx-auto mb-2 flex items-center justify-center">
                                                <Shield className="w-6 h-6 md:w-8 md:h-8" />
                                            </div>
                                            <p className="text-sm font-medium">Secure Login</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Google Login Button */}
                                <button
                                    onClick={signInWithGoogle}
                                    disabled={isLoading}
                                    className="w-full mb-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm md:text-base">Continue with Google</span>
                                </button>

                                {/* Divider */}
                                <div className="relative w-full mb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-black text-gray-400">or</span>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-4 w-full">
                                    <button
                                        onClick={() => setActiveTab('email')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg transition-all text-sm md:text-base ${activeTab === 'email'
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-md border border-white/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        <span className="font-medium">Email</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('phone')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2.5 md:py-3 rounded-lg transition-all text-sm md:text-base ${activeTab === 'phone'
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-md border border-white/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span className="font-medium">Phone</span>
                                    </button>
                                </div>

                                {/* Email Input */}
                                {activeTab === 'email' && (
                                    <div className="space-y-4 w-full">
                                        <div>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    placeholder="Enter your email address"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all text-sm md:text-base`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Phone Input */}
                                {activeTab === 'phone' && (
                                    <div className="space-y-4 w-full">
                                        <div>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">+91</div>
                                                <input
                                                    type="tel"
                                                    placeholder="Enter mobile number"
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    className={`w-full pl-20 pr-4 py-3 bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                                                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all text-sm md:text-base`}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={sendOTP}
                                    disabled={isLoading}
                                    className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Sending OTP...</span>
                                        </div>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </>
                        )}

                        {/* OTP Step */}
                        {currentStep === 'otp' && (
                            <>
                                <button
                                    onClick={goBack}
                                    className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 self-start text-sm md:text-base"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </button>

                                <div className="space-y-6 w-full">
                                    <div className="text-center">
                                        <p className="text-gray-300 text-sm">
                                            Code sent to{' '}
                                            <span className="text-white font-medium">
                                                {activeTab === 'email'
                                                    ? formData.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
                                                    : `+91 ${formData.phone.replace(/(.{2})(.{6})(.{2})/, '$1******$3')}`
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            value={formData.otp}
                                            onChange={(e) => handleOtpChange(e.target.value)}
                                            className={`w-full px-4 py-4 bg-white/5 border ${errors.otp ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                                                } rounded-xl text-white text-center text-lg md:text-xl font-mono tracking-widest placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all`}
                                            maxLength="6"
                                        />
                                        {errors.otp && (
                                            <p className="text-red-400 text-sm mt-2 text-center">{errors.otp}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={verifyOTP}
                                        disabled={isLoading || formData.otp.length !== 6}
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                <span>Verifying...</span>
                                            </div>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        {timer > 0 ? (
                                            <p className="text-gray-400 text-sm">
                                                Resend OTP in <span className="text-white font-mono">{timer}s</span>
                                            </p>
                                        ) : (
                                            <button
                                                onClick={resendOTP}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
      `}</style>
        </BackgroundLines>
    );
};

export default Login;