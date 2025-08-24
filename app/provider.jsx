"use client"

import { supabase } from '@/services/supaBaseClient'
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from './context/UserDetailContext';

const Provider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        CreateNewUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN') {
                    CreateNewUser();
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [])

    const CreateNewUser = async () => {
        try {
            setLoading(true);

            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            console.log("your user", authUser);
            // Check if user exists in database
            let { data: Users, error } = await supabase
                .from('Users')
                .select("*")
                .or(`email.eq.${authUser?.email},phone.eq.${authUser?.phone}`);

            if (error) {
                console.error('Error fetching user:', error);
                setLoading(false);
                return;
            }

            const phone =
                authUser?.phone ||
                authUser?.user_metadata?.phone ||
                authUser?.identities?.[0]?.identity_data?.phone_number ||
                null;
            console.log("your phone:", phone);

            // If user doesn't exist, create new user
            if (Users?.length === 0) {
                const newUserData = {
                    email: authUser?.email || null,
                    phone: phone,
                    picture: authUser?.user_metadata?.picture || authUser?.user_metadata?.avatar_url || null,
                    name: authUser?.user_metadata?.name || authUser?.user_metadata?.full_name || null,
                };

                const { data, error: insertError } = await supabase
                    .from("Users")
                    .insert([newUserData])
                    .select()
                    .single();

                if (insertError) {
                    console.error('Error creating user:', insertError);
                    setLoading(false);
                    return;
                }

                console.log('New user created:', data);
                setUser(data);
            } else {
                // User exists, use existing data
                console.log('Existing user found:', Users[0]);
                setUser(Users[0]);
            }
        } catch (error) {
            console.error('Error in CreateNewUser:', error);
        } finally {
            setLoading(false);
        }
    }

    const updateUserName = async (name) => {
        if (!user?.id || !name.trim()) return false;

        try {
            const { data, error } = await supabase
                .from('Users')
                .update({ name: name.trim() })
                .eq('id', user.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating user name:', error);
                return false;
            }

            // Update local user state
            setUser(prevUser => ({ ...prevUser, name: name.trim() }));

            // Also update Supabase auth metadata
            await supabase.auth.updateUser({
                data: { full_name: name.trim() }
            });

            console.log('User name updated successfully:', data);
            return true;
        } catch (error) {
            console.error('Error updating user name:', error);
            return false;
        }
    }

    return (
        <UserDetailContext.Provider value={{
            user,
            setUser,
            loading,
            updateUserName,
            refreshUser: CreateNewUser
        }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider

export const useUser = () => {
    const context = useContext(UserDetailContext);
    if (!context) {
        throw new Error('useUser must be used within a Provider');
    }
    return context;
}