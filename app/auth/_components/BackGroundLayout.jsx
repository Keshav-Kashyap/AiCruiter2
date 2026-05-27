import React from 'react';

const BackgroundLayout = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0b0d12] px-4 py-8 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_18%),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_100%,72px_72px,72px_72px] opacity-40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_28%)]" />

            <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default BackgroundLayout;

