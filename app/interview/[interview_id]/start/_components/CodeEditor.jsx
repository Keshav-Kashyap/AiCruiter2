"use client"

import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Download, Upload, Copy, Check, Loader2, Terminal, Settings, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CodeEditor = () => {
    const [code, setCode] = useState(`// Welcome to the Code Editor
// Write your code here and click Run to execute

function greet(name) {
    console.log("Hello, " + name + "!");
}

greet("World");
`);
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [theme, setTheme] = useState('vs-dark');
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);
    const editorRef = useRef(null);

    const languageOptions = [
        { value: 'javascript', label: 'JavaScript ✓', version: '18.15.0', supported: true },
        { value: 'typescript', label: 'TypeScript ✓', version: '5.0.3', supported: true },
        { value: 'python', label: 'Python (Limited)', version: '3.10.0', supported: false },
        { value: 'java', label: 'Java (View Only)', version: '15.0.2', supported: false },
        { value: 'cpp', label: 'C++ (View Only)', version: '10.2.0', supported: false },
        { value: 'c', label: 'C (View Only)', version: '10.2.0', supported: false },
        { value: 'go', label: 'Go (View Only)', version: '1.16.2', supported: false },
        { value: 'rust', label: 'Rust (View Only)', version: '1.68.2', supported: false },
    ];

    const codeTemplates = {
        javascript: `// JavaScript Code
console.log("Hello, World!");

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`,
        python: `# Python Code
print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci(10):", fibonacci(10))`,
        java: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Fibonacci(10): " + fibonacci(10));
    }
    
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
        cpp: `// C++ Code
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Hello, World!" << endl;
    cout << "Fibonacci(10): " << fibonacci(10) << endl;
    return 0;
}`,
        c: `// C Code
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Hello, World!\\n");
    printf("Fibonacci(10): %d\\n", fibonacci(10));
    return 0;
}`,
        typescript: `// TypeScript Code
const message: string = "Hello, World!";
console.log(message);

function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`,
        go: `// Go Code
package main
import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Fibonacci(10):", fibonacci(10))
}`,
        rust: `// Rust Code
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    println!("Hello, World!");
    println!("Fibonacci(10): {}", fibonacci(10));
}`
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const runCode = async () => {
        setIsRunning(true);
        setOutput('Running code...\n');

        try {
            const response = await fetch('/api/execute-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    language,
                    code,
                    version: languageOptions.find(l => l.value === language)?.version
                }),
            });

            const data = await response.json();

            if (data.error && data.success === false) {
                let errorMsg = '';
                if (data.note) {
                    errorMsg += `${data.note}\n\n`;
                }
                errorMsg += `${data.stderr || data.error}`;
                setOutput(errorMsg);
                toast.info(data.note || 'Language not fully supported');
            } else if (!data.success && data.stderr) {
                setOutput(`${data.note ? data.note + '\n\n' : ''}${data.stderr}`);
                toast.warning('Limited support for this language');
            } else {
                let result = '';

                if (data.note) {
                    result += `${data.note}\n\n`;
                }

                if (data.stdout) {
                    result += `${data.stdout}\n`;
                }
                if (data.stderr && data.success) {
                    result += `\nWarnings:\n${data.stderr}\n`;
                }
                if (!data.stdout && !data.stderr) {
                    result = data.note || 'Code executed successfully with no output.';
                }
                setOutput(result);
                toast.success('Code executed successfully');
            }
        } catch (error) {
            console.error('Error running code:', error);
            setOutput(`Error: ${error.message}`);
            toast.error('Failed to execute code');
        } finally {
            setIsRunning(false);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        setCode(codeTemplates[newLang] || `// ${newLang} code here`);
        setOutput('');
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadCode = () => {
        const extensions = {
            javascript: 'js',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            c: 'c',
            typescript: 'ts',
            go: 'go',
            rust: 'rs'
        };
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${extensions[language] || 'txt'}`;
        a.click();
        toast.success('Code downloaded');
    };

    const uploadCode = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCode(event.target.result);
                toast.success('Code loaded successfully');
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-blue-400" />
                        <h3 className="text-white font-semibold text-sm">Code Editor</h3>
                    </div>

                    {/* Language Selector */}
                    <select
                        value={language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-gray-700 text-white px-3 py-1.5 rounded text-sm border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                        {languageOptions.map(lang => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={copyCode}
                            className="p-1.5 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Copy Code"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={downloadCode}
                            className="p-1.5 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Download Code"
                        >
                            <Download className="w-4 h-4" />
                        </button>

                        <label className="p-1.5 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors cursor-pointer" title="Upload Code">
                            <Upload className="w-4 h-4" />
                            <input type="file" onChange={uploadCode} className="hidden" accept=".js,.py,.java,.cpp,.c,.ts,.go,.rs,.txt" />
                        </label>

                        <button
                            onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
                            className="p-1.5 hover:bg-gray-700 rounded text-gray-300 hover:text-white transition-colors"
                            title="Toggle Theme"
                        >
                            <Settings className="w-4 h-4" />
                        </button>

                        <Button
                            onClick={runCode}
                            disabled={isRunning}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8 text-xs"
                        >
                            {isRunning ? (
                                <>
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    Running...
                                </>
                            ) : (
                                <>
                                    <Play className="w-3 h-3 mr-1" />
                                    Run Code
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    theme={theme}
                    onChange={(value) => setCode(value || '')}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                    }}
                />
            </div>

            {/* Output Panel */}
            <div className="bg-gray-800 border-t border-gray-700 h-40">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span className="text-white text-xs font-semibold">Output</span>
                    </div>
                    {output && (
                        <button
                            onClick={() => setOutput('')}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="p-3 overflow-auto h-[calc(100%-36px)]">
                    <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap">
                        {output || 'Click "Run Code" to see output here...'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
