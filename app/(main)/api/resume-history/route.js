import { NextResponse } from 'next/server';
import { supabase } from '@/services/supaBaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get all resumes for the user
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching resumes:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            resumes: data || []
        });

    } catch (error) {
        console.error('Error fetching resume history:', error);
        return NextResponse.json(
            { error: 'Failed to fetch resume history', details: error.message },
            { status: 500 }
        );
    }
}

// Delete a resume
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const resumeId = searchParams.get('resumeId');
        const userId = searchParams.get('userId');

        if (!resumeId || !userId) {
            return NextResponse.json(
                { error: 'Resume ID and User ID are required' },
                { status: 400 }
            );
        }

        // Delete from database
        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', resumeId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error deleting resume:', error);
            throw error;
        }

        // Try to delete PDF from storage if it exists
        try {
            const { data: files } = await supabase
                .storage
                .from('resume-pdfs')
                .list(`${userId}`);

            if (files) {
                const resumeFile = files.find(f => f.name.startsWith(resumeId));
                if (resumeFile) {
                    await supabase
                        .storage
                        .from('resume-pdfs')
                        .remove([`${userId}/${resumeFile.name}`]);
                }
            }
        } catch (storageErr) {
            console.error('Storage deletion error:', storageErr);
            // Don't fail the request if storage deletion fails
        }

        return NextResponse.json({
            success: true,
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting resume:', error);
        return NextResponse.json(
            { error: 'Failed to delete resume', details: error.message },
            { status: 500 }
        );
    }
}
