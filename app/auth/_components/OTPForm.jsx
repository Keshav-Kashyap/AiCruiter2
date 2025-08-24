import React from 'react';
import { ArrowLeft } from 'lucide-react';
import InputField from './InputField';
import LoadingButton from './LoadingButton';

const BackButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center text-gray-400 hover:text-white transition-colors mb-4 self-start text-sm md:text-base"
    >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
    </button>
);

const MaskedContact = ({ activeTab, email, phone }) => {
    const maskedValue = activeTab === 'email'
        ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        : `+91 ${phone.replace(/(.{2})(.{6})(.{2})/, '$1******$3')}`;

    return (
        <div className="text-center">
            <p className="text-gray-300 text-sm">
                Code sent to{' '}
                <span className="text-white font-medium">
                    {maskedValue}
                </span>
            </p>
        </div>
    );
};

const ResendTimer = ({ timer, onResend, isLoading }) => (
    <div className="text-center">
        {timer > 0 ? (
            <p className="text-gray-400 text-sm">
                Resend OTP in <span className="text-white font-mono">{timer}s</span>
            </p>
        ) : (
            <button
                onClick={onResend}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
                Resend OTP
            </button>
        )}
    </div>
);

const OTPForm = ({
    activeTab,
    formData,
    errors,
    isLoading,
    timer,
    handleOtpChange,
    verifyOTP,
    resendOTP,
    goBack
}) => {
    return (
        <>
            <BackButton onClick={goBack} />

            <div className="space-y-6 w-full">
                <MaskedContact
                    activeTab={activeTab}
                    email={formData.email}
                    phone={formData.phone}
                />

                <InputField
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleOtpChange}
                    error={errors.otp}
                    className="text-center text-lg md:text-xl font-mono tracking-widest"
                    maxLength="6"
                />

                <LoadingButton
                    onClick={verifyOTP}
                    isLoading={isLoading}
                    disabled={isLoading || formData.otp.length !== 6}
                    loadingText="Verifying..."
                >
                    Verify OTP
                </LoadingButton>

                <ResendTimer
                    timer={timer}
                    onResend={resendOTP}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};

export default OTPForm;