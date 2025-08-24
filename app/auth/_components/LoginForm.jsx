import React from 'react';
import { Mail, Phone, Shield } from 'lucide-react';
import GoogleLoginButton from './GoogleLoginButton';
import AuthTabs from './AuthTabs';
import InputField from './InputField';
import LoadingButton from './LoadingButton';

const LoginImagePlaceholder = () => (
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
);

const Divider = () => (
    <div className="relative w-full mb-4">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-400">or</span>
        </div>
    </div>
);

const LoginForm = ({
    activeTab,
    setActiveTab,
    formData,
    errors,
    isLoading,
    handleInputChange,
    signInWithGoogle,
    sendOTP
}) => {
    return (
        <>
            <LoginImagePlaceholder />

            <GoogleLoginButton
                onClick={signInWithGoogle}
                isLoading={isLoading}
            />

            <Divider />

            <AuthTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Email Input */}
            {activeTab === 'email' && (
                <div className="space-y-4 w-full">
                    <InputField
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(value) => handleInputChange('email', value)}
                        icon={<Mail className="w-5 h-5" />}
                        error={errors.email}
                    />
                </div>
            )}

            {/* Phone Input */}
            {activeTab === 'phone' && (
                <div className="space-y-4 w-full">
                    <InputField
                        type="tel"
                        placeholder="Enter mobile number"
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value.replace(/\D/g, '').slice(0, 10))}
                        icon={<Phone className="w-5 h-5" />}
                        prefix="+91"
                        error={errors.phone}
                    />
                </div>
            )}

            <LoadingButton
                onClick={sendOTP}
                isLoading={isLoading}
                loadingText="Sending OTP..."
                className="mt-4"
            >
                Send OTP
            </LoadingButton>
        </>
    );
};

export default LoginForm;