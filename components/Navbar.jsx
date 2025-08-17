"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function Navbar({ onDashboard }) {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (window.scrollY > lastScrollY) {
                // scroll down → hide
                setVisible(false);
            } else {
                // scroll up → show
                setVisible(true);
            }
            setLastScrollY(window.scrollY);
        };

        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastScrollY]);

    const Button = ({ onClick, className, children }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded font-medium transition-all duration-200 ${className}`}
        >
            {children}
        </button>
    );

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between 
        backdrop-blur-xl px-8 py-5 animate-fadeInUp 
        transform transition-transform duration-500
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
        >
            <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300">


                <img src="/logo2.png" className='h-15' />

                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                    QRA Interview
                </h1>

            </div>

            <div className="flex gap-20 items-center justify-center">   <Link
                href="/features"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
            >
                Features
            </Link>
                <Link
                    href="/pricing"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                >
                    Pricing
                </Link>
                <Link
                    href="/about"
                    className="text-slate-300 hover:text-blue-400 transition-colors duration-200 font-medium"
                >
                    About
                </Link> </div>

            <div className="hidden md:flex items-center gap-8">

                <Button
                    onClick={onDashboard}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                    Dashboard
                </Button>
            </div>

            <Button
                onClick={onDashboard}
                className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
                Dashboard
            </Button>
        </nav>
    );
}








