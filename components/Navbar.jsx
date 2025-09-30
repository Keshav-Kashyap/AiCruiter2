"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { PremiumButton } from './PremiumButton';

export default function Navbar({ onDashboard }) {
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.menu-button')) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileMenuOpen]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const Button = ({ onClick, className, children }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded font-medium transition-all duration-200 ${className}`}
        >
            {children}
        </button>
    );

    const navLinks = [
        { href: "/features", label: "Features" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about", label: "About" }
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between 
          px-4 sm:px-6 lg:px-8 py-4 sm:py-5 animate-fadeInUp 
         transform transition-transform duration-500
        ${visible ? "translate-y-0" : "-translate-y-full"}`}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-2 sm:gap-4 hover:scale-105 transition-transform duration-300">
                    <img src="/logo2.png" className='h-10 sm:h-12 lg:h-15 w-auto' alt="QRA Logo" />
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text whitespace-nowrap">


                        QRA
                    </h1>
                </div>



                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex gap-8 xl:gap-20 items-center justify-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-slate-300 hover:text-slate-100 transition-colors duration-200 font-medium whitespace-nowrap"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Dashboard Button */}
                <div className="hidden lg:flex items-center" >

                    <PremiumButton label="Dashboard" onClick={onDashboard} />



                </div>

                {/* Mobile Controls */}
                <div className="lg:hidden flex items-center gap-2 sm:gap-3">
                    {/* Mobile Dashboard Button */}
                    <Button
                        onClick={onDashboard}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 text-sm rounded-lg font-medium shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        Dashboard
                    </Button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="menu-button p-2 text-slate-300 hover:text-blue-400 transition-colors duration-200"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            />

            {/* Mobile Menu */}
            <div
                className={`lg:hidden mobile-menu fixed top-0 right-0 h-full w-64 sm:w-72 bg-black/95 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Menu</h2>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 text-slate-300 hover:text-white transition-colors duration-200"
                        aria-label="Close mobile menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex flex-col py-6">
                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-1 px-6 mb-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-slate-300 hover:text-blue-400 hover:bg-white/5 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Dashboard Button */}
                    <div className="px-6">
                        <Button
                            onClick={() => {
                                onDashboard();
                                setMobileMenuOpen(false);
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200"
                        >
                            Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }

                @media (max-width: 640px) {
                    .mobile-menu {
                        width: 100vw;
                    }
                }
            `}</style>
        </>
    );
}