"use client";

import { supabase } from '@/services/supaBaseClient';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const UserDetailContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
                try {
                    return JSON.parse(cachedUser);
                } catch (e) {
                    console.error('Error parsing cached user:', e);
                }
            }
        }
        return null;
    });

    const [loading, setLoading] = useState(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('user')) {
            return false;
        }
        return true;
    });

    useEffect(() => {
        CreateNewUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_IN') {
                    CreateNewUser();
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('user');
                        localStorage.removeItem('userName');
                    }
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const saveUserToLocalStorage = (userData) => {
        if (typeof window !== 'undefined' && userData) {
            if (userData.name) {
                localStorage.setItem('userName', userData.name);
            }
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    const removeUserFromLocalStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            localStorage.removeItem('userName');
        }
    };

    const CreateNewUser = async () => {
        try {
            if (!user) {
                setLoading(true);
            }

            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (!authUser) {
                setUser(null);
                removeUserFromLocalStorage();
                setLoading(false);
                return;
            }

            console.log("your user", authUser);
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

                setUser(data);
                saveUserToLocalStorage(data);
            } else {
                setUser(Users[0]);
                saveUserToLocalStorage(Users[0]);
            }
        } catch (error) {
            console.error('Error in CreateNewUser:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserName = async (name) => {
        let userToUpdate = user;

        if (!userToUpdate || !userToUpdate.id) {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();

                if (authUser) {
                    let { data: dbUser, error: dbError } = await supabase
                        .from('Users')
                        .select("*")
                        .eq('email', authUser.email)
                        .single();

                    if (!dbError && dbUser) {
                        userToUpdate = dbUser;
                    }
                }
            } catch (error) {
                console.error('Error getting fresh user data:', error);
            }
        }

        if (!userToUpdate?.id || !name.trim()) {
            console.error('No user ID found or name is empty');
            return false;
        }

        try {
            const { data, error } = await supabase
                .from('Users')
                .update({ name: name.trim() })
                .eq('id', userToUpdate.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating user name:', error);
                return false;
            }

            const updatedUser = { ...userToUpdate, name: name.trim() };
            setUser(updatedUser);
            saveUserToLocalStorage(updatedUser);

            await supabase.auth.updateUser({
                data: { full_name: name.trim() }
            });

            return true;
        } catch (error) {
            console.error('Error updating user name:', error);
            return false;
        }
    };

    return (
        <UserDetailContext.Provider value={{
            user,
            setUser,
            loading,
            updateUserName,
            refreshUser: CreateNewUser
        }}>
            {children}
        </UserDetailContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserDetailContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export default UserProvider;
