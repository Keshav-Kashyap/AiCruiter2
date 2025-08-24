"use client"

import React from 'react';
import { Edit2, Save, X } from 'lucide-react';

const ProfileHeader = ({ isEditing, setIsEditing, handleSave, handleCancel, loading }) => {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 px-6 py-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                        <Edit2 size={16} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100"
                        >
                            <Save size={16} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;