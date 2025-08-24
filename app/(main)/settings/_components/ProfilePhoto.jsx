"use client"

import React from 'react';
import { User, Camera } from 'lucide-react';
import Image from 'next/image';

const ProfilePhoto = ({ user, isEditing, editedProfile, handlePhotoUpload }) => {
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-600 shadow-lg">
                    {(isEditing ? editedProfile.photo : user?.picture) ? (
                        <Image
                            src={isEditing ? editedProfile.photo : user?.picture}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex items-center justify-center">
                            <User size={48} className="text-blue-500 dark:text-blue-400" />
                        </div>
                    )}
                </div>

                {/* Camera Icon for Photo Upload */}
                {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
                        <Camera size={16} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                        />
                    </label>
                )}
            </div>
            {isEditing && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click camera icon to upload photo</p>
            )}
        </div>
    );
};

export default ProfilePhoto;
