"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const ImageSlider = () => {

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            alt: "AI Interview Dashboard"
        },
        {
            url: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            alt: "Team Meeting Interface"
        },
        {
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            alt: "Analytics Dashboard"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    return (
        <div className="relative mx-auto max-w-4xl opacity-0 animate-fadeInUp"
            style={{ animationDelay: '0.5s' }}>
            <div className="relative rounded-3xl border  bg-black  p-4 shadow-2xl shadow-slate-900/20 overflow-hidden">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-20 blur-lg animate-pulse" />


                <div className="relative overflow-hidden rounded-2xl border border-slate-600/50">

                    {/* Slider Container */}
                    <div className="relative aspect-[16/10] w-full">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                                    ? 'opacity-100 transform translate-x-0'
                                    : index < currentSlide
                                        ? 'opacity-0 transform -translate-x-full'
                                        : 'opacity-0 transform translate-x-full'
                                    }`}
                            >
                                <img
                                    src={slide.url}
                                    alt={slide.alt}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200 hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all duration-200 hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-white scale-110 shadow-lg'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageSlider