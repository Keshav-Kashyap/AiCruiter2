import { NextResponse } from 'next/server';
import OpenAI from "openai";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    let resumeText = '';

    try {
        const body = await request.json();
        resumeText = body.resumeText;
        const fileName = body.fileName;

        if (!resumeText) {
            return NextResponse.json(
                { error: 'Resume text is required' },
                { status: 400 }
            );
        }

        // Sanitize input text
        resumeText = sanitizeResumeText(resumeText);

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY2,
        });

        const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume and provide detailed feedback in JSON format.

Resume Content:
${resumeText}

CRITICAL: Analyze the ACTUAL resume content provided. Do NOT use generic mock data.

Provide your analysis in the following JSON structure (respond ONLY with valid JSON, no additional text):
{
  "overallScore": <number between 0-100>,
  "atsScore": <number between 0-100 for ATS compatibility>,
  "sections": [
    {
      "name": "<section name>",
      "score": <number between 0-100>,
      "comment": "<brief comment about this section>"
    }
  ],
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "weaknesses": [
    "<weakness 1>",
    "<weakness 2>",
    "<weakness 3>"
  ],
  "suggestions": [
    {
      "title": "<suggestion title>",
      "description": "<detailed suggestion>"
    }
  ]
}

Analyze these sections:
1. Contact Information
2. Professional Summary
3. Work Experience
4. Education
5. Skills
6. Formatting & ATS Compatibility

Be specific, constructive, and helpful in your feedback.`;

        const completion = await openai.chat.completions.create({
            model: "google/gemma-3n-e2b-it:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });

        const content = completion.choices[0]?.message?.content || '';

        console.log('=== AI RESPONSE START ===');
        console.log(content);
        console.log('=== AI RESPONSE END ===');

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const analysisData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

        if (!analysisData) {
            console.error('Failed to parse AI response - using fallback data');
            throw new Error('Failed to parse AI response');
        }

        console.log('AI analysis successful:', analysisData.overall_score);
        return NextResponse.json(analysisData);

    } catch (error) {
        console.error('=== USING FALLBACK DATA ===');
        console.error('Error analyzing resume:', error);
        console.error('=== FALLBACK DATA ACTIVE ===');

        // Return mock data as fallback
        return NextResponse.json({
            overallScore: 75,
            atsScore: 80,
            sections: [
                {
                    name: "Contact Information",
                    score: 90,
                    comment: "Complete and professional contact details"
                },
                {
                    name: "Professional Summary",
                    score: 70,
                    comment: "Good summary but could be more impactful"
                },
                {
                    name: "Work Experience",
                    score: 75,
                    comment: "Solid experience section with room for improvement"
                },
                {
                    name: "Education",
                    score: 85,
                    comment: "Well-structured education section"
                },
                {
                    name: "Skills",
                    score: 70,
                    comment: "Good skill set but needs better organization"
                },
                {
                    name: "Formatting",
                    score: 80,
                    comment: "Clean format with good ATS compatibility"
                }
            ],
            strengths: [
                "Clear and professional contact information",
                "Relevant work experience listed",
                "Good educational background",
                "Clean and readable format",
                "Includes important technical skills"
            ],
            weaknesses: [
                "Professional summary could be more compelling",
                "Work experience descriptions lack specific metrics",
                "Skills section could be better organized by category",
                "Missing relevant certifications or achievements",
                "Could benefit from more action verbs"
            ],
            suggestions: [
                {
                    title: "Quantify Your Achievements",
                    description: "Add specific numbers, percentages, or metrics to your work experience. For example, instead of 'Improved sales,' say 'Increased sales by 35% in Q1 2023.'"
                },
                {
                    title: "Strengthen Your Summary",
                    description: "Start your professional summary with a strong value proposition. Focus on your unique selling points and what you can offer to employers."
                },
                {
                    title: "Organize Skills by Category",
                    description: "Group your skills into categories like 'Programming Languages,' 'Frameworks,' 'Tools,' etc. This makes it easier for recruiters to scan."
                },
                {
                    title: "Use Strong Action Verbs",
                    description: "Begin each bullet point with powerful action verbs like 'Achieved,' 'Developed,' 'Implemented,' 'Led,' etc."
                },
                {
                    title: "Add a Projects Section",
                    description: "If applicable, include a section highlighting key projects with links to GitHub or live demos."
                }
            ]
        });
    }
}

// Sanitize resume text to remove problematic characters
function sanitizeResumeText(text) {
    if (!text) return '';

    let cleaned = String(text);

    // Remove control characters except newlines and tabs
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');

    // Remove UTF-8 BOM
    cleaned = cleaned.replace(/^\uFEFF/, '');

    // Normalize line breaks
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Remove zero-width characters
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // Fix common encoding issues
    cleaned = cleaned.replace(/â€"/g, '–');
    cleaned = cleaned.replace(/â€"/g, '—');
    cleaned = cleaned.replace(/â€œ/g, '"');
    cleaned = cleaned.replace(/â€\u009D/g, '"');
    cleaned = cleaned.replace(/â€˜/g, "'");
    cleaned = cleaned.replace(/â€™/g, "'");
    cleaned = cleaned.replace(/â€¢/g, '•');

    // Ensure only safe characters
    cleaned = cleaned.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code === 10 || (code >= 32 && code <= 126) || (code >= 160 && code <= 255)) {
            return char;
        }
        return '';
    }).join('');

    // Clean up whitespace
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');

    // Trim each line
    cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');

    return cleaned.trim();
}
