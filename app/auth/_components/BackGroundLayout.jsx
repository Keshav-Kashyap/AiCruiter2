import React from 'react';

const BackgroundLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black px-4 py-8">
            {/* Floating orbs */}
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

            {children}

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
        </div>
    );
};

export default BackgroundLayout;

