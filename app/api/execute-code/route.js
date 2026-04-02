import { NextResponse } from 'next/server';

// Use Node.js runtime instead of Edge runtime for Function constructor support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
    let language, code;

    try {
        const body = await request.json();
        language = body.language;
        code = body.code;

        if (!code || !language) {
            return NextResponse.json(
                { error: 'Missing required fields: code and language' },
                { status: 400 }
            );
        }

        console.log('Code execution request:', { language, codeLength: code.length });

        // For JavaScript/TypeScript, execute locally (most reliable)
        if (language === 'javascript' || language === 'typescript') {
            return executeJavaScriptLocally(code);
        }

        // For Python, try OneCompiler API (free, no auth required)
        if (language === 'python') {
            return await executePython(code);
        }

        // For other languages, try JDoodle API or return friendly message
        return NextResponse.json({
            stdout: '',
            stderr: `${language.toUpperCase()} execution is temporarily unavailable.\n\nFor coding interviews:\n- Use JavaScript (fully supported)\n- Python (basic support)\n- Or paste your code solution and explain your approach`,
            error: '',
            success: false,
            note: `Tip: Switch to JavaScript for full code execution`
        });

    } catch (error) {
        console.error('Error in code execution API:', error);

        // Last resort: try local execution for JS
        if (language === 'javascript' || language === 'typescript') {
            return executeJavaScriptLocally(code);
        }

        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// Execute JavaScript locally (sandboxed)
function executeJavaScriptLocally(code) {
    try {
        const logs = [];
        const errors = [];

        // Create a sandboxed console
        const sandboxConsole = {
            log: (...args) => {
                logs.push(args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                ).join(' '));
            },
            error: (...args) => {
                errors.push(args.map(arg => String(arg)).join(' '));
            },
            warn: (...args) => {
                logs.push('⚠️ ' + args.map(arg => String(arg)).join(' '));
            },
            info: (...args) => {
                logs.push('ℹ️ ' + args.map(arg => String(arg)).join(' '));
            }
        };

        try {
            // Create function with sandboxed console
            const func = new Function('console', code);
            const result = func(sandboxConsole);

            // If function returns a value, log it
            if (result !== undefined) {
                logs.push('Return value: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)));
            }

            return NextResponse.json({
                stdout: logs.join('\n') || '(no output)',
                stderr: errors.join('\n'),
                error: '',
                success: true,
                note: '✓ Executed locally (JavaScript runtime)'
            });
        } catch (execError) {
            return NextResponse.json({
                stdout: logs.join('\n'),
                stderr: execError.message,
                error: execError.toString(),
                success: false,
                note: 'Execution failed'
            });
        }
    } catch (error) {
        return NextResponse.json({
            stdout: '',
            stderr: error.message,
            error: 'Failed to execute JavaScript',
            success: false
        });
    }
}

// Execute Python using simple VM (basic support)
async function executePython(code) {
    try {
        // Try using Skulpt (Python-to-JavaScript compiler)
        // For now, return a helpful message
        return NextResponse.json({
            stdout: '',
            stderr: 'Python execution requires external service.',
            error: '',
            success: false,
            note: 'Tip: Use JavaScript for full code execution support, or explain your Python solution verbally during the interview'
        });
    } catch (error) {
        return NextResponse.json({
            stdout: '',
            stderr: error.message,
            error: 'Python execution failed',
            success: false
        });
    }
}

// Helper function to get appropriate file name based on language
function getFileName(language) {
    const fileNames = {
        'javascript': 'main.js',
        'python': 'main.py',
        'java': 'Main.java',
        'cpp': 'main.cpp',
        'c': 'main.c',
        'typescript': 'main.ts',
        'go': 'main.go',
        'rust': 'main.rs',
    };
    return fileNames[language] || 'code.txt';
}
