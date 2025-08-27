import React from 'react';

const OTPForm = ({
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
        <div className="space-y-6">
            {/* Email Display */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    Verification code sent to
                </p>
                <p className="font-medium text-gray-900">
                    {formData.email}
                </p>
            </div>

            {/* OTP Input */}
            <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit code
                </label>
                <input
                    id="otp"
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleOtpChange(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className={`w-full px-3 py-3 text-center text-2xl font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.otp ? 'border-red-500' : 'border-gray-300'
                        }`}
                    disabled={isLoading}
                />
                {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                )}
            </div>

            {/* Timer */}
            {timer > 0 && (
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Resend code in <span className="font-medium text-blue-600">{timer}s</span>
                    </p>
                </div>
            )}

            {/* Verify Button */}
            <button
                onClick={verifyOTP}
                disabled={isLoading || formData.otp.length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Verifying...
                    </div>
                ) : (
                    'Verify Code'
                )}
            </button>

            {/* Resend and Back Options */}
            <div className="flex flex-col space-y-3">
                {timer === 0 && (
                    <button
                        onClick={resendOTP}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                    >
                        Resend verification code
                    </button>
                )}

                <button
                    onClick={goBack}
                    disabled={isLoading}
                    className="text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50"
                >
                    ← Change email address
                </button>
            </div>
        </div>
    );
};

export default OTPForm;