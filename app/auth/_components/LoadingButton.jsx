import React from 'react';

const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

const LoadingButton = ({
    onClick,
    isLoading,
    disabled,
    loadingText,
    children,
    className = "",
    variant = "primary",
    ...props
}) => {
    const baseClasses = "w-full py-3 font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white",
        secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
        ghost: "text-blue-400 hover:text-blue-300"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                    <LoadingSpinner />
                    <span>{loadingText || 'Loading...'}</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default LoadingButton;