import React from 'react';
import { Check } from 'lucide-react';

const ProgressBar = () => (
    <div className="mt-6">
        <div className="w-full bg-white/10 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-full animate-pulse"></div>
        </div>
    </div>
);

const SuccessView = () => {
    return (
        <div className="text-center py-6 md:py-8 w-full">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
            </div>
            <p className="text-white text-lg font-semibold mb-2">Login Successful!</p>
            <p className="text-gray-400 text-sm">You will be redirected shortly...</p>
            <ProgressBar />
        </div>
    );
};

export default SuccessView;