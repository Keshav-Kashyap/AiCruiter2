"use client"

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supaBaseClient';
import ProfileForm from './_components/ProfileForm';
import LogoutButton from './_components/LogoutButton';
import ProfileHeader from './_components/ProfileHeader';
import ProfilePhoto from './_components/ProfilePhoto';
import { toast } from 'sonner';

export default function UserSettings() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [originalUserData, setOriginalUserData] = useState(null);
    const userObj = useUser();
    const user = userObj?.user;

    const [editedProfile, setEditedProfile] = useState({
        name: '',
        email: '',
        phone: '',
        photo: null,
        emailVerified: true,
        phoneVerified: true,
        loginMethod: 'email' // 'email' or 'phone'
    });

    // Determine login method and verification status
    const determineLoginMethod = (userData) => {
        if (userData?.email && !userData?.phone) {
            return { loginMethod: 'email', emailVerified: true, phoneVerified: false };
        } else if (userData?.phone && !userData?.email) {
            return { loginMethod: 'phone', emailVerified: false, phoneVerified: true };
        } else if (userData?.email && userData?.phone) {
            // Both exist - determine primary login method (can be enhanced based on your auth logic)
            return { loginMethod: 'email', emailVerified: true, phoneVerified: true };
        }
        return { loginMethod: 'email', emailVerified: false, phoneVerified: false };
    };

    // Update edited profile when user data changes
    useEffect(() => {
        if (user) {
            const verificationData = determineLoginMethod(user);
            const profileData = {
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                photo: user.picture || null,
                ...verificationData
            };

            setEditedProfile(profileData);
            setOriginalUserData(profileData);
        }
    }, [user, refreshTrigger]);

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // File size check (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedProfile({ ...editedProfile, photo: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle field changes and update verification status
    const handleFieldChange = (field, value) => {
        const updatedProfile = { ...editedProfile, [field]: value };

        // Update verification status based on changes
        if (field === 'email' && originalUserData) {
            updatedProfile.emailVerified = value === originalUserData.email;
        }
        if (field === 'phone' && originalUserData) {
            updatedProfile.phoneVerified = value === originalUserData.phone;
        }

        setEditedProfile(updatedProfile);
    };

    const updateProfile = async () => {
        // Validation based on login method
        if (!editedProfile.name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        // If user logged in with email, email is required
        if (originalUserData?.loginMethod === 'email' && !editedProfile.email.trim()) {
            toast.error('Email is required for your account');
            return;
        }

        // If user logged in with phone, phone is required
        if (originalUserData?.loginMethod === 'phone' && !editedProfile.phone.trim()) {
            toast.error('Phone number is required for your account');
            return;
        }

        if (editedProfile.email && !editedProfile.email.includes('@')) {
            toast.error('Please enter a valid email');
            return;
        }

        let phone = editedProfile.phone || "";
        phone = phone.replace(/^(\+91|91)/, "");


        if (phone && !/^[6-9]\d{9}$/.test(phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            // Determine which field to use for the where clause
            const whereClause = user?.email
                ? { email: user.email }
                : { phone: user.phone };

            const updateData = {
                name: editedProfile.name.trim(),
                picture: editedProfile.photo
            };

            // Only update email if it's provided and different
            if (editedProfile.email.trim()) {
                updateData.email = editedProfile.email.trim();
            }

            // Only update phone if it's provided and different
            if (editedProfile.phone.trim()) {
                updateData.phone = editedProfile.phone.trim();
            }

            const { data, error } = await supabase
                .from('Users')
                .update(updateData)
                .match(whereClause)
                .select();

            if (error) {
                console.error('Error updating profile:', error);
                toast.error('Failed to update profile: ' + error.message);
            } else {
                console.log('Profile updated successfully:', data);
                toast.success('Profile updated successfully!');

                // Update user context if available
                if (userObj?.setUser && data?.[0]) {
                    const updatedUser = {
                        ...user,
                        name: data[0].name,
                        email: data[0].email,
                        phone: data[0].phone,
                        picture: data[0].picture
                    };
                    userObj.setUser(updatedUser);
                }

                // Show verification warning if needed
                if (!editedProfile.emailVerified || !editedProfile.phoneVerified) {
                    toast.info('Please verify your updated contact information');
                }

                // Trigger re-render
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        await updateProfile();
        setIsEditing(false);
    };

    const handleCancel = () => {
        if (originalUserData) {
            setEditedProfile({ ...originalUserData });
        }
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 bg-gray-50 dark:bg-gray-900">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-300 opacity-30 animate-ping"></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-all duration-300">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your profile and account settings</p>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3"></div>
                </div>

                {/* Profile Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100/50 dark:border-gray-700/50 overflow-hidden">
                    <ProfileHeader
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        loading={loading}
                    />

                    <div className="p-8">
                        <ProfilePhoto
                            user={user}
                            isEditing={isEditing}
                            editedProfile={editedProfile}
                            handlePhotoUpload={handlePhotoUpload}
                        />

                        <ProfileForm
                            user={user}
                            isEditing={isEditing}
                            editedProfile={editedProfile}
                            setEditedProfile={setEditedProfile}
                            handleFieldChange={handleFieldChange}
                            originalUserData={originalUserData}
                        />
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl border border-red-200/50 dark:border-red-800/50 p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-30"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Danger Zone</h3>
                            <p className="text-sm text-red-600 dark:text-red-400">Irreversible actions that affect your account</p>
                        </div>
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}