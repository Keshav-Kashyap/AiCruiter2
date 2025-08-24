import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User } from 'lucide-react';
import { useUser } from '@/app/provider';

const UserDetails = ({
    formData,
    errors,
    isLoading,
    handleInputChange,
    handleUserDetailsSubmit,
    goBack
}) => {
    const { user } = useUser();

    // Pre-fill name if it exists in user data
    useEffect(() => {
        if (user?.name && !formData.userName) {
            handleInputChange('userName', user.name);
        }
    }, [user, formData.userName, handleInputChange]);
    const handleSubmit = (e) => {
        e.preventDefault();
        handleUserDetailsSubmit();
    };

    return (
        <div className="w-full space-y-6">
            {/* Header with back button */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={goBack}
                    className="p-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
                    disabled={isLoading}
                >
                    <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-semibold text-white">Complete Your Profile</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="userName" className="text-white text-sm font-medium">
                        Your Full Name *
                    </Label>
                    <Input
                        id="userName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.userName}
                        onChange={(e) => handleInputChange('userName', e.target.value)}
                        className={`w-full h-12 px-4 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.userName
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                        disabled={isLoading}
                        autoComplete="name"
                        autoFocus
                    />
                    {errors.userName && (
                        <p className="text-red-400 text-xs mt-1">
                            {errors.userName}
                        </p>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading || !formData.userName.trim()}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Setting up...</span>
                            </div>
                        ) : (
                            'Complete Setup'
                        )}
                    </Button>
                </div>
            </form>

            <div className="text-center">
                <p className="text-white/60 text-xs">
                    This information helps us personalize your experience
                </p>
            </div>
        </div>
    );
};

export default UserDetails;