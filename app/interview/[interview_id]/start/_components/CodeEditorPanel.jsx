"use client";

import CodeEditor from './CodeEditor';

const CodeEditorPanel = ({ showCodeEditor, editorWidth, setEditorWidth }) => {
    if (!showCodeEditor) {
        return null;
    }

    const handleMouseDown = (event) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = editorWidth;

        const handleMouseMove = (moveEvent) => {
            const diff = startX - moveEvent.clientX;
            const nextWidth = Math.min(Math.max(startWidth + (diff / window.innerWidth) * 100, 30), 70);
            setEditorWidth(nextWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            <div
                className='w-1 bg-gray-300 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-500 cursor-col-resize transition-colors'
                onMouseDown={handleMouseDown}
            />

            <div className='bg-gray-900 overflow-hidden' style={{ width: `${editorWidth}%` }}>
                <CodeEditor />
            </div>
        </>
    );
};

export default CodeEditorPanel;