import { NextResponse } from 'next/server';
import { supabase } from '@/services/supaBaseClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const {
            userId,
            fileName,
            originalContent,
            improvedContent,
            analysisData,
            pdfBlob
        } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Save resume data to Supabase database
        const { data, error } = await supabase
            .from('resumes')
            .insert([
                {
                    user_id: userId,
                    file_name: fileName || 'Untitled Resume',
                    original_content: originalContent,
                    improved_content: improvedContent || originalContent,
                    analysis_data: analysisData,
                    overall_score: analysisData?.overallScore || 0,
                    ats_score: analysisData?.atsScore || 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error saving resume to database:', error);
            throw error;
        }

        // If PDF blob is provided, save to storage
        if (pdfBlob && data) {
            try {
                const pdfFileName = `${userId}/${data.id}_${fileName || 'resume'}.pdf`;

                // Convert base64 to buffer if needed
                const pdfBuffer = Buffer.from(pdfBlob.split(',')[1] || pdfBlob, 'base64');

                const { error: storageError } = await supabase
                    .storage
                    .from('resume-pdfs')
                    .upload(pdfFileName, pdfBuffer, {
                        contentType: 'application/pdf',
                        upsert: true
                    });

                if (storageError) {
                    console.error('Error uploading PDF to storage:', storageError);
                }
            } catch (storageErr) {
                console.error('Storage error:', storageErr);
                // Don't fail the whole request if storage fails
            }
        }

        return NextResponse.json({
            success: true,
            resumeId: data.id,
            message: 'Resume saved successfully'
        });

    } catch (error) {
        console.error('Error saving resume:', error);
        return NextResponse.json(
            { error: 'Failed to save resume', details: error.message },
            { status: 500 }
        );
    }
}

// Update existing resume
export async function PUT(request) {
    try {
        const {
            resumeId,
            userId,
            improvedContent,
            analysisData
        } = await request.json();

        if (!resumeId || !userId) {
            return NextResponse.json(
                { error: 'Resume ID and User ID are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('resumes')
            .update({
                improved_content: improvedContent,
                analysis_data: analysisData,
                overall_score: analysisData?.overallScore || 0,
                ats_score: analysisData?.atsScore || 0,
                updated_at: new Date().toISOString()
            })
            .eq('id', resumeId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating resume:', error);
            throw error;
        }

        return NextResponse.json({
            success: true,
            message: 'Resume updated successfully'
        });

    } catch (error) {
        console.error('Error updating resume:', error);
        return NextResponse.json(
            { error: 'Failed to update resume', details: error.message },
            { status: 500 }
        );
    }
}
