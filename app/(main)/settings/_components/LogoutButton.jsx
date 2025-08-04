"use client"

import React from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '@/services/supaBaseClient';
import { toast } from 'sonner';


const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error);
                toast.error('Error logging out');
            } else {
                toast.success('Logout successful!');
                window.location.href = '/auth';
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error logging out');
        }
    };

    return (
        <div className="mt-6">
            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-medium shadow-lg transition-all transform hover:scale-105"
            >
                <LogOut size={20} />
                Logout
            </button>
        </div>
    );
};

export default LogoutButton;