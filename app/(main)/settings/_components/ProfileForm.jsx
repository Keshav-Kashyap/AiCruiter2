"use client"

import React from 'react';
import { User, Mail, Phone, Shield, ShieldCheck, ShieldX, AlertTriangle } from 'lucide-react';

const ProfileForm = ({ user, isEditing, editedProfile, setEditedProfile, handleFieldChange, originalUserData }) => {

    const VerificationBadge = ({ isVerified, field }) => {
        if (isVerified) {
            return (
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full text-xs font-medium">
                    <ShieldX className="w-3 h-3" />
                    <span>Not Verified</span>
                </div>
            );
        }
    };

    const RequiredBadge = () => (
        <span className="text-red-500 text-sm font-medium">*</span>
    );

    const isEmailRequired = originalUserData?.loginMethod === 'email';
    const isPhoneRequired = originalUserData?.loginMethod === 'phone';

    return (
        <div className="space-y-8">
            {/* Name Field */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                        <User size={14} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    Full Name
                    <RequiredBadge />
                </label>
                {isEditing ? (
                    <div className="relative">
                        <input
                            type="text"
                            value={editedProfile.name || ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setEditedProfile({ ...editedProfile, name: newValue });
                                if (handleFieldChange) handleFieldChange('name', newValue);
                            }}
                            className="w-full px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Enter your full name"
                        />
                    </div>
                ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300">
                        {user?.name || 'No name set'}
                    </div>
                )}
            </div>

            {/* Email Field */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                            <Mail size={14} className="text-green-600 dark:text-green-400" />
                        </div>
                        Email Address
                        {isEmailRequired && <RequiredBadge />}
                    </label>
                    {(editedProfile.email || user?.email) && (
                        <VerificationBadge
                            isVerified={editedProfile.emailVerified}
                            field="email"
                        />
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <input
                            type="email"
                            value={editedProfile.email || ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setEditedProfile({ ...editedProfile, email: newValue });
                                if (handleFieldChange) handleFieldChange('email', newValue);
                            }}
                            className="w-full px-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Enter your email address"
                            disabled={isEmailRequired && !editedProfile.email} // Don't allow clearing required email
                        />
                        {!editedProfile.emailVerified && editedProfile.email !== originalUserData?.email && (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Email change will require verification</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300">
                        {user?.email || 'No email set'}
                    </div>
                )}
            </div>

            {/* Phone Field */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
                        <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                            <Phone size={14} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        Phone Number
                        {isPhoneRequired && <RequiredBadge />}
                    </label>
                    {(editedProfile.phone || user?.phone) && (
                        <VerificationBadge
                            isVerified={editedProfile.phoneVerified}
                            field="phone"
                        />
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm font-medium bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                +91
                            </div>
                            <input
                                type="tel"
                                value={editedProfile.phone || ''}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setEditedProfile({ ...editedProfile, phone: newValue });
                                    if (handleFieldChange) handleFieldChange('phone', newValue);
                                }}
                                className="w-full pl-16 pr-4 py-3 border border-blue-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Enter 10-digit mobile number"
                                maxLength="10"
                                disabled={isPhoneRequired && !editedProfile.phone} // Don't allow clearing required phone
                            />
                        </div>
                        {!editedProfile.phoneVerified && editedProfile.phone !== originalUserData?.phone && (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Phone change will require verification</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enter your 10-digit mobile number without +91</p>
                    </div>
                ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300">
                        {user?.phone
                            ? `${user.phone.replace(/^91/, "")}`
                            : "No phone number set"}
                    </div>
                )}
            </div>

            {/* Login Method Info */}
            {originalUserData?.loginMethod && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Account Information</span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        You signed up using your {originalUserData.loginMethod === 'email' ? 'email address' : 'phone number'}.
                        This field cannot be removed but can be updated.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProfileForm;