"use client"

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { supabase } from '@/services/supaBaseClient';
import { toast } from 'sonner';

const LogoutButton = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
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
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
            <LogOut size={18} />
            {isLoggingOut ? 'Logging out...' : 'Logout from Account'}
        </button>
    );
};

export default LogoutButton;