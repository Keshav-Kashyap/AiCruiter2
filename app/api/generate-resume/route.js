import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const resumeData = await request.json();

        // Generate HTML resume
        const htmlContent = generateResumeHTML(resumeData);

        // In a production app, you would use a library like puppeteer or jsPDF
        // to convert HTML to PDF. For now, we'll return HTML that can be printed as PDF

        return new NextResponse(htmlContent, {
            headers: {
                'Content-Type': 'text/html',
                'Content-Disposition': `attachment; filename="${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.html"`
            }
        });

    } catch (error) {
        console.error('Error generating resume:', error);
        return NextResponse.json(
            { error: 'Failed to generate resume', details: error.message },
            { status: 500 }
        );
    }
}

function generateResumeHTML(data) {
    const { personalInfo, summary, experience, education, skills, projects } = data;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 21cm;
            margin: 0 auto;
            padding: 2cm;
            background: white;
        }
        
        h1 {
            font-size: 32px;
            color: #2563eb;
            margin-bottom: 5px;
        }
        
        h2 {
            font-size: 20px;
            color: #2563eb;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        
        h3 {
            font-size: 16px;
            color: #1e40af;
            margin-bottom: 5px;
        }
        
        .contact-info {
            margin-bottom: 20px;
            color: #666;
            font-size: 14px;
        }
        
        .contact-info a {
            color: #2563eb;
            text-decoration: none;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 15px;
        }
        
        .job-header, .edu-header, .project-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }
        
        .company, .institution, .project-name {
            font-weight: bold;
            color: #1e40af;
        }
        
        .duration, .year {
            color: #666;
            font-style: italic;
            font-size: 14px;
        }
        
        .position, .degree {
            color: #555;
            font-size: 15px;
            margin-bottom: 5px;
        }
        
        .description {
            margin-left: 20px;
            color: #555;
            font-size: 14px;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
        }
        
        .summary-text {
            color: #555;
            font-size: 15px;
            line-height: 1.8;
        }
        
        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <h1>${personalInfo.fullName}</h1>
        <div class="contact-info">
            ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span> | 📱 ${personalInfo.phone}</span>` : ''}
            ${personalInfo.location ? `<span> | 📍 ${personalInfo.location}</span>` : ''}
            ${personalInfo.linkedin ? `<br><span>🔗 <a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
            ${personalInfo.portfolio ? `<span> | 🌐 <a href="${personalInfo.portfolio}" target="_blank">Portfolio</a></span>` : ''}
        </div>
    </header>

    ${summary ? `
    <!-- Professional Summary -->
    <section class="section">
        <h2>Professional Summary</h2>
        <p class="summary-text">${summary}</p>
    </section>
    ` : ''}

    ${experience && experience.some(exp => exp.company || exp.position) ? `
    <!-- Work Experience -->
    <section class="section">
        <h2>Work Experience</h2>
        ${experience.map(exp => exp.company || exp.position ? `
        <div class="experience-item">
            <div class="job-header">
                <span class="company">${exp.company || 'Company'}</span>
                <span class="duration">${exp.duration || ''}</span>
            </div>
            <div class="position">${exp.position || 'Position'}</div>
            ${exp.description ? `<div class="description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        ` : '').join('')}
    </section>
    ` : ''}

    ${education && education.some(edu => edu.institution || edu.degree) ? `
    <!-- Education -->
    <section class="section">
        <h2>Education</h2>
        ${education.map(edu => edu.institution || edu.degree ? `
        <div class="education-item">
            <div class="edu-header">
                <span class="institution">${edu.institution || 'Institution'}</span>
                <span class="year">${edu.year || ''}</span>
            </div>
            <div class="degree">${edu.degree || 'Degree'}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
        </div>
        ` : '').join('')}
    </section>
    ` : ''}

    ${skills && skills.length > 0 ? `
    <!-- Skills -->
    <section class="section">
        <h2>Skills</h2>
        <div class="skills-list">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
    </section>
    ` : ''}

    ${projects && projects.some(proj => proj.name) ? `
    <!-- Projects -->
    <section class="section">
        <h2>Projects</h2>
        ${projects.map(proj => proj.name ? `
        <div class="project-item">
            <div class="project-header">
                <span class="project-name">${proj.name}</span>
            </div>
            ${proj.description ? `<div class="description">${proj.description}</div>` : ''}
            ${proj.technologies ? `<div class="description"><strong>Technologies:</strong> ${proj.technologies}</div>` : ''}
            ${proj.link ? `<div class="description"><a href="${proj.link}" target="_blank">${proj.link}</a></div>` : ''}
        </div>
        ` : '').join('')}
    </section>
    ` : ''}

    <script>
        // Auto-print when page loads
        window.onload = function() {
            window.print();
        }
    \u003c/script>
</body>
</html>`;

    return html;
}
