"use client"

import React from 'react';
import { motion } from 'framer-motion';

const BackgroundLines = ({ children }) => (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black px-4 py-8">
        {/* Floating orbs with framer-motion */}
        <motion.div
            className="absolute top-10 left-10 md:top-20 md:left-20 w-48 h-48 md:w-72 md:h-72 bg-blue-400/20 rounded-full blur-3xl"
            animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1]
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />

        <motion.div
            className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
                y: [0, -15, 0],
                rotate: [0, -5, 0],
                scale: [1, 0.9, 1]
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />

        {children}
    </div>
);

export default BackgroundLines;