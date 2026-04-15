import { NextResponse } from 'next/server';
import OpenAI from "openai";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const resumeData = await request.json();

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY2,
        });

        const prompt = `You are an expert resume writer. Enhance the following resume information to make it more professional, impactful, and ATS-friendly.

Current Resume Data:
${JSON.stringify(resumeData, null, 2)}

Improve:
1. Professional summary - Make it more compelling and targeted
2. Work experience descriptions - Add action verbs, quantify achievements where possible
3. Project descriptions - Make them more detailed and impactful
4. Ensure all content is professional and error-free

Return the enhanced resume data in the same JSON structure, but with improved content. Respond with ONLY valid JSON, no additional text.`;

        const completion = await openai.chat.completions.create({
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.5,
            max_tokens: 3000,
        });

        const content = completion.choices[0]?.message?.content || '';

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const enhancedData = jsonMatch ? JSON.parse(jsonMatch[0]) : resumeData;

        return NextResponse.json({ resumeData: enhancedData });

    } catch (error) {
        console.error('Error enhancing resume:', error);

        // Return original data with slight enhancements as fallback
        const resumeData = await request.json();
        return NextResponse.json({ resumeData });
    }
}
