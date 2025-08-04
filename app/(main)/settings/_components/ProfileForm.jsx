"use client"

import React from 'react';
import { User, Mail } from 'lucide-react';

const ProfileForm = ({ user, isEditing, editedProfile, setEditedProfile }) => {
    return (
        <div className="space-y-6">
            {/* Name Field */}
            <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <User size={18} className="text-blue-500" />
                    Full Name
                </label>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter your full name"
                    />
                ) : (
                    <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                        {user?.name || 'No name set'}
                    </div>
                )}
            </div>

            {/* Email Field */}
            <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Mail size={18} className="text-green-500" />
                    Email Address
                </label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    {user?.email || 'No email set'}
                </div>
                {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed for security reasons</p>
                )}
            </div>
        </div>
    );
};

export default ProfileForm;