import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req) {
    try {
        const body = await req.json();
        const email = String(body?.email || '').trim().toLowerCase();
        const password = String(body?.password || '');
        const name = String(body?.name || '').trim();

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
        });

        if (listError) {
            console.error('Error listing auth users:', listError);
            return NextResponse.json(
                { error: 'Failed to read auth users' },
                { status: 500 }
            );
        }

        const existingAuthUser = usersData?.users?.find((user) => user.email?.toLowerCase() === email);

        if (existingAuthUser) {
            const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
                existingAuthUser.id,
                {
                    password,
                    email_confirm: true,
                    user_metadata: { full_name: name },
                }
            );

            if (updateAuthError) {
                console.error('Error updating auth user:', updateAuthError);
                return NextResponse.json(
                    { error: updateAuthError.message || 'Failed to update auth user' },
                    { status: 500 }
                );
            }
        } else {
            const { error: createAuthError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name: name },
            });

            if (createAuthError) {
                console.error('Error creating auth user:', createAuthError);
                return NextResponse.json(
                    { error: createAuthError.message || 'Failed to create auth user' },
                    { status: 500 }
                );
            }
        }

        const { data: existingProfile, error: profileLookupError } = await supabase
            .from('Users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (profileLookupError) {
            console.error('Error reading profile:', profileLookupError);
            return NextResponse.json(
                { error: 'Failed to read profile record' },
                { status: 500 }
            );
        }

        const profilePayload = {
            email,
            name,
            picture: existingProfile?.picture || null,
            phone: existingProfile?.phone || null,
        };

        let profileResult;

        if (existingProfile) {
            const { data, error: updateProfileError } = await supabase
                .from('Users')
                .update(profilePayload)
                .eq('email', email)
                .select()
                .single();

            if (updateProfileError) {
                console.error('Error updating profile:', updateProfileError);
                return NextResponse.json(
                    { error: updateProfileError.message || 'Failed to update profile' },
                    { status: 500 }
                );
            }

            profileResult = data;
        } else {
            const { data, error: insertProfileError } = await supabase
                .from('Users')
                .insert([profilePayload])
                .select()
                .single();

            if (insertProfileError) {
                console.error('Error creating profile:', insertProfileError);
                return NextResponse.json(
                    { error: insertProfileError.message || 'Failed to create profile' },
                    { status: 500 }
                );
            }

            profileResult = data;
        }

        return NextResponse.json({
            success: true,
            user: profileResult,
        });
    } catch (error) {
        console.error('Register user error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}