import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { resumeContent, format } = await request.json();

        if (!resumeContent || !format) {
            return NextResponse.json(
                { error: 'Resume content and format are required' },
                { status: 400 }
            );
        }

        // Clean and sanitize content before processing
        const cleanedContent = sanitizeText(resumeContent);

        console.log('=== DOWNLOAD RESUME DEBUG ===');
        console.log('Format:', format);
        console.log('Content length:', resumeContent?.length);
        console.log('First 200 chars:', resumeContent?.substring(0, 200));
        console.log('Cleaned length:', cleanedContent?.length);
        console.log('=== END DEBUG ===');

        if (format === 'pdf') {
            const pdfBuffer = await generatePDF(cleanedContent);

            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="improved_resume.pdf"',
                },
            });
        } else if (format === 'docx') {
            const docxBuffer = await generateDOCX(cleanedContent);

            return new NextResponse(docxBuffer, {
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition': 'attachment; filename="improved_resume.docx"',
                },
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid format. Use pdf or docx' },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Error generating resume file:', error);
        return NextResponse.json(
            { error: 'Failed to generate resume file', details: error.message },
            { status: 500 }
        );
    }
}

// Sanitize text to remove problematic characters and encoding issues
function sanitizeText(text) {
    if (!text) return '';

    // Convert to string and normalize
    let cleaned = String(text);

    // Remove null bytes and other control characters except newlines, tabs, and carriage returns
    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');

    // Remove any UTF-8 BOM markers
    cleaned = cleaned.replace(/^\uFEFF/, '');

    // Normalize line breaks to \n
    cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Remove excessive whitespace while preserving intentional breaks
    cleaned = cleaned.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n'); // Max 3 consecutive line breaks

    // Remove zero-width characters and other invisible Unicode
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

    // Fix common encoding issues - convert to pure ASCII
    cleaned = cleaned.replace(/[–—−]/g, '-'); // All dashes
    cleaned = cleaned.replace(/[""]/g, '"'); // Smart quotes
    cleaned = cleaned.replace(/['']/g, "'"); // Smart apostrophes  
    cleaned = cleaned.replace(/[•●◦]/g, '*'); // Bullets
    cleaned = cleaned.replace(/…/g, '...'); // Ellipsis

    // Convert ALL to pure ASCII only (codes 32-126 + newline 10)
    cleaned = cleaned.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code === 10) return char; // Newline
        if (code >= 32 && code <= 126) return char; // ASCII printable

        // Map common special chars
        const map = { 'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ñ': 'n', 'ç': 'c', 'ß': 'ss', '°': 'deg', '±': '+/-', '×': 'x', '÷': '/', '©': '(c)', '®': '(R)', '™': '(TM)' };
        return map[char] || '';
    }).join('');

    // Final cleanup - remove multiple spaces again
    cleaned = cleaned.replace(/  +/g, ' ');

    // Trim each line
    cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');

    return cleaned.trim();
}

// Generate professional PDF using jsPDF
async function generatePDF(content) {
    console.log('=== PDF GENERATION START ===');

    // Strip markdown bold syntax and preserve text
    let processedContent = content;
    processedContent = processedContent.replace(/\*\*([^\*]+)\*\*/g, '$1'); // **text** -> text
    processedContent = processedContent.replace(/\*([^\*]+)\*/g, '$1'); // *text* -> text
    processedContent = processedContent.replace(/__([^_]+)__/g, '$1'); // __text__ -> text
    processedContent = processedContent.replace(/_([^_]+)_/g, '$1'); // _text_ -> text

    console.log('Markdown stripped, first 300 chars:', processedContent.substring(0, 300));

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);
    let y = margin;

    // Parse content into structured sections
    const lines = processedContent.split('\n');
    let isFirstLine = true;
    let currentSection = null;

    const addText = (text, options = {}) => {
        const {
            size = 10,
            style = 'normal',
            color = [0, 0, 0],
            align = 'left',
            indent = 0,
            lineSpacing = 1.2
        } = options;

        // Check for new page
        if (y > pageHeight - 20) {
            doc.addPage();
            y = margin;
        }

        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);

        const xPos = margin + indent;
        const effectiveWidth = maxWidth - indent;

        if (text.trim()) {
            const splitLines = doc.splitTextToSize(text, effectiveWidth);
            splitLines.forEach((line, index) => {
                if (y > pageHeight - 20) {
                    doc.addPage();
                    y = margin;
                }

                if (align === 'center') {
                    doc.text(line, pageWidth / 2, y, { align: 'center' });
                } else {
                    doc.text(line, xPos, y);
                }

                y += size * 0.35 * lineSpacing;
            });
        } else {
            y += size * 0.2;
        }
    };

    const addLine = (yPos) => {
        doc.setDrawColor(60, 60, 60);
        doc.setLineWidth(0.3);
        doc.line(margin, yPos, pageWidth - margin, yPos);
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines at the start
        if (!trimmedLine && y === margin) return;

        // Detect name (usually first non-empty line or all caps at start)
        if (isFirstLine && trimmedLine && trimmedLine.length > 0) {
            isFirstLine = false;
            // If it looks like a name (short, possibly all caps)
            if (trimmedLine.length < 50 && !trimmedLine.includes('@') && !trimmedLine.match(/\d{10}/)) {
                addText(trimmedLine, {
                    size: 18,
                    style: 'bold',
                    color: [0, 51, 102],
                    align: 'center'
                });
                y += 3;
                return;
            }
        }

        // Detect contact info (email, phone, location)
        if (trimmedLine.match(/@|linkedin|github|portfolio|http/i) ||
            trimmedLine.match(/\d{10}|\(\d{3}\)|\d{3}-\d{3}/)) {
            addText(trimmedLine, {
                size: 9,
                style: 'normal',
                color: [60, 60, 60],
                align: 'center'
            });
            return;
        }

        // Detect section headers
        const sectionPattern = /^(PROFESSIONAL SUMMARY|SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|LANGUAGES|INTERESTS)/i;
        if (sectionPattern.test(trimmedLine) ||
            (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3 && trimmedLine.length < 40 && !trimmedLine.match(/[•\-\*]/))) {

            console.log('SECTION DETECTED:', trimmedLine);

            y += 4;
            currentSection = trimmedLine;

            addText(trimmedLine.toUpperCase(), {
                size: 12,
                style: 'bold',
                color: [0, 51, 102]
            });

            // Add underline
            addLine(y - 1);
            y += 3;
            return;
        }

        // Detect bullet points
        if (trimmedLine.match(/^[•\-\*\◦]/)) {
            const cleanedText = trimmedLine.replace(/^[•\-\*\◦]\s*/, '');

            // Draw bullet
            doc.setFillColor(0, 51, 102);
            doc.circle(margin + 2, y - 1, 0.8, 'F');

            addText(cleanedText, {
                size: 10,
                style: 'normal',
                indent: 5,
                lineSpacing: 1.3
            });
            return;
        }

        // Detect job title / position (usually bold text or dates)
        if (trimmedLine.match(/\b(20\d{2}|19\d{2})\b/) && trimmedLine.length < 100) {
            addText(trimmedLine, {
                size: 10,
                style: 'bold',
                color: [40, 40, 40]
            });
            y += 1;
            return;
        }

        // Detect company/organization (after job title, usually has location or industry keywords)
        if (currentSection === 'EXPERIENCE' || currentSection === 'WORK EXPERIENCE') {
            if (trimmedLine.length > 0 && trimmedLine.length < 100 &&
                !trimmedLine.match(/^[•\-\*]/) &&
                !trimmedLine.match(/\b(managed|developed|created|led|implemented)/i)) {
                addText(trimmedLine, {
                    size: 10,
                    style: 'italic',
                    color: [80, 80, 80]
                });
                y += 1;
                return;
            }
        }

        // Regular content
        if (trimmedLine) {
            addText(trimmedLine, {
                size: 10,
                style: 'normal',
                lineSpacing: 1.3
            });
        } else {
            y += 2;
        }
    });

    // Add footer with page numbers
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Return as buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('=== PDF GENERATED ===');
    console.log('Buffer size:', pdfBuffer.length, 'bytes');
    console.log('=== PDF GENERATION END ===');
    return pdfBuffer;
}

// Generate professional DOCX using docx library
async function generateDOCX(content) {
    const lines = content.split('\n');
    const paragraphs = [];
    let isFirstLine = true;
    let currentSection = null;

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines at start
        if (!trimmedLine && paragraphs.length === 0) return;

        // Detect name (first line)
        if (isFirstLine && trimmedLine && trimmedLine.length > 0) {
            isFirstLine = false;
            if (trimmedLine.length < 50 && !trimmedLine.includes('@') && !trimmedLine.match(/\d{10}/)) {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: trimmedLine,
                                font: 'Calibri',
                                size: 32, // 16pt
                                bold: true,
                                color: '003366',
                            }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            after: 120,
                        },
                    })
                );
                return;
            }
        }

        // Detect contact info
        if (trimmedLine.match(/@|linkedin|github|portfolio|http/i) ||
            trimmedLine.match(/\d{10}|\(\d{3}\)|\d{3}-\d{3}/)) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmedLine,
                            font: 'Calibri',
                            size: 20, // 10pt
                            color: '666666',
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: {
                        after: 80,
                    },
                })
            );
            return;
        }

        // Detect section headers
        const sectionPattern = /^(PROFESSIONAL SUMMARY|SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EDUCATION|SKILLS|TECHNICAL SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|LANGUAGES|INTERESTS)/i;
        if (sectionPattern.test(trimmedLine) ||
            (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3 && trimmedLine.length < 40 && !trimmedLine.match(/[•\-\*]/))) {

            currentSection = trimmedLine;
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmedLine.toUpperCase(),
                            font: 'Calibri',
                            size: 24, // 12pt
                            bold: true,
                            color: '003366',
                        }),
                    ],
                    spacing: {
                        before: 240,
                        after: 120,
                    },
                    border: {
                        bottom: {
                            color: '003366',
                            space: 1,
                            value: 'single',
                            size: 6,
                        },
                    },
                })
            );
            return;
        }

        // Detect bullet points
        if (trimmedLine.match(/^[•\-\*\◦]/)) {
            const cleanedText = trimmedLine.replace(/^[•\-\*\◦]\s*/, '');
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: cleanedText,
                            font: 'Calibri',
                            size: 22, // 11pt
                        }),
                    ],
                    bullet: {
                        level: 0,
                    },
                    spacing: {
                        after: 120,
                    },
                })
            );
            return;
        }

        // Detect job title / position with dates
        if (trimmedLine.match(/\b(20\d{2}|19\d{2})\b/) && trimmedLine.length < 100) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmedLine,
                            font: 'Calibri',
                            size: 22, // 11pt
                            bold: true,
                        }),
                    ],
                    spacing: {
                        before: 120,
                        after: 60,
                    },
                })
            );
            return;
        }

        // Detect company/organization
        if (currentSection === 'EXPERIENCE' || currentSection === 'WORK EXPERIENCE') {
            if (trimmedLine.length > 0 && trimmedLine.length < 100 &&
                !trimmedLine.match(/^[•\-\*]/) &&
                !trimmedLine.match(/\b(managed|developed|created|led|implemented)/i)) {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: trimmedLine,
                                font: 'Calibri',
                                size: 22, // 11pt
                                italics: true,
                                color: '555555',
                            }),
                        ],
                        spacing: {
                            after: 100,
                        },
                    })
                );
                return;
            }
        }

        // Regular content
        if (trimmedLine) {
            paragraphs.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmedLine,
                            font: 'Calibri',
                            size: 22, // 11pt
                        }),
                    ],
                    spacing: {
                        after: 120,
                    },
                })
            );
        } else {
            paragraphs.push(new Paragraph({ text: '' }));
        }
    });

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 720,    // 0.5 inch
                        right: 720,
                        bottom: 720,
                        left: 720,
                    },
                },
            },
            children: paragraphs,
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
}

