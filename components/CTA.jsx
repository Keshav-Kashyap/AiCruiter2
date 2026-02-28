"use client"
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PremiumButton } from "./PremiumButton";

export default function CTA({ onDashboard }) {
  return (
    <div className="w-full bg-black py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent" />
      
      {/* Animated gradient blobs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">100% Free Forever</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text text-transparent">
              Ready to Ace Your Next Interview?
            </span>
          </h2>

          {/* Description */}
          <p className="text-neutral-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of successful candidates who prepared with our AI-powered interview platform. Start practicing today and land your dream job!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PremiumButton 
              variant="fill" 
              label={
                <span className="flex items-center gap-2">
                  Start Free Interview
                  <ArrowRight className="w-4 h-4" />
                </span>
              }
              onClick={onDashboard}
            />
            <button className="px-8 py-3 rounded-lg border border-neutral-700 text-white hover:bg-white/5 transition-all duration-300 font-medium">
              View Features
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-neutral-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>10,000+ Happy Users</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
