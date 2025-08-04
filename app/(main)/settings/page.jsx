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
    const userObj = useUser();
    const user = userObj?.user;

    const [editedProfile, setEditedProfile] = useState({
        name: '',
        photo: null
    });

    // Update edited profile when user data changes
    useEffect(() => {
        if (user) {
            setEditedProfile({
                name: user.name || '',
                photo: user.picture || null
            });
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

    const updateProfile = async () => {
        if (!user?.email) {
            toast.error('User email not found');
            return;
        }

        // Validation
        if (!editedProfile.name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Users')
                .update({
                    name: editedProfile.name.trim(),
                    picture: editedProfile.photo
                })
                .eq('email', user.email)
                .select();

            if (error) {
                console.error('Error updating profile:', error);
                toast.error('Failed to update profile');
            } else {
                console.log('Profile updated successfully:', data);
                toast.success('Profile updated successfully!');

                // Update user context if available
                if (userObj?.setUser && data?.[0]) {
                    const updatedUser = {
                        ...user,
                        name: data[0].name,
                        picture: data[0].picture
                    };
                    userObj.setUser(updatedUser);
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
        setEditedProfile({
            name: user?.name || '',
            photo: user?.picture || null
        });
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-300 opacity-30 animate-ping"></div>
                </div>
                <p className="text-sm text-gray-500 animate-pulse">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your profile and account settings</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                    <ProfileHeader
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                        loading={loading}
                    />

                    <div className="p-6">
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
                        />
                    </div>
                </div>

                <LogoutButton />

            </div>
        </div>
    );
}