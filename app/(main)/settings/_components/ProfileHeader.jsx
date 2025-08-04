"use client"

import React from 'react';
import { Edit2, Save, X } from 'lucide-react';

const ProfileHeader = ({ isEditing, setIsEditing, handleSave, handleCancel, loading }) => {
    return (
        <div className=" bg-blue-500 px-6 py-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Save size={16} />
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
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