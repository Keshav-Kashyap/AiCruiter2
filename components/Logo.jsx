import React from 'react';
import { Mic } from 'lucide-react';

export default function AnimatedMicrophone() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            {/* Main Container */}
            <div className="relative w-40 h-40">

                {/* Outermost Sparkling Circle */}
                <div
                    className="absolute -inset-8 w-56 h-56 rounded-full animate-spin opacity-80"
                    style={{
                        background: 'conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
                        animationDuration: '10s',
                        animationTimingFunction: 'linear',
                        padding: '2px'
                    }}
                >
                    <div className="w-full h-full rounded-full bg-black"></div>
                </div>

                {/* Second Outer Rotating Circle with Glow */}
                <div
                    className="absolute -inset-4 w-48 h-48 rounded-full animate-spin opacity-90"
                    style={{
                        background: 'conic-gradient(from 180deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)',
                        animationDuration: '6s',
                        animationTimingFunction: 'linear',
                        animationDirection: 'reverse',
                        padding: '3px'
                    }}
                >
                    <div className="w-full h-full rounded-full bg-black"></div>
                </div>

                {/* Main Rotating Border Circle */}
                <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                        background: 'conic-gradient(from 90deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6)',
                        animationDuration: '8s',
                        animationTimingFunction: 'linear',
                        padding: '4px'
                    }}
                >
                    <div className="w-full h-full rounded-full bg-black"></div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 blur-3xl animate-pulse" />

                {/* Additional Pulsing Glow */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 opacity-30 blur-2xl animate-pulse"
                    style={{ animationDuration: '2s' }} />

                {/* Inner circle button */}
                <button className="relative flex items-center justify-center w-24 h-24 mx-auto mt-8 rounded-full bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 shadow-2xl shadow-purple-500/50 hover:scale-105 transition-transform duration-300">
                    <Mic className="w-10 h-10 text-white" />

                    {/* Inner button glow */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-pulse"></div>
                </button>

                {/* Sparkling Dots */}
                <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-75"
                    style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-75"
                    style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"
                    style={{ animationDelay: '0.5s' }}></div>

                {/* Outer glow ring */}
                <div className="absolute -inset-12 w-64 h-64 rounded-full bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 blur-3xl animate-pulse"
                    style={{ animationDuration: '3s' }}></div>

            </div>
        </div>
    );
}