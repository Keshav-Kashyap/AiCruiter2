import React from 'react';

const InputField = ({
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    error,
    className = "",
    prefix = null,
    ...props
}) => {
    return (
        <div className="w-full">
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                        {icon}
                    </div>
                )}
                {prefix && (
                    <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        {prefix}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full ${icon ? 'pl-12' : 'pl-4'} ${prefix ? 'pl-20' : ''} pr-4 py-3 bg-white/5 border ${error ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all text-sm md:text-base ${className}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default InputField;