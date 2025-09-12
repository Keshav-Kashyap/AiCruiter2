"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

export function SparklesPreviewbg({ children }) {
  return (
    <div className="min-h-screen relative w-full bg-black flex flex-col overflow-hidden">
      {/* Sparkles Background - Fixed positioning to cover entire viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      
      {/* Content wrapper with proper z-index */}
      <div className="relative z-10 w-full flex-1">
        {children}
      </div>
    </div>
  );
}