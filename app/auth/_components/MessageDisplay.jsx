import React from 'react';

const MessageDisplay = ({ success, errors }) => {
    return (
        <>
            {/* Success Message */}
            {success && (
                <div className="w-full mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm text-center">
                    {success}
                </div>
            )}

            {/* General Error */}
            {errors.general && (
                <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                    {errors.general}
                </div>
            )}

            {/* Google Error */}
            {errors.google && (
                <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                    {errors.google}
                </div>
            )}
        </>
    );
};

export default MessageDisplay;  