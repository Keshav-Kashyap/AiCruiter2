
"use client"
import Navbar from "@/components/Navbar";
import { MoveRight, Sparkles, Users, Target, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "./provider";
import Loading from "@/components/Loading";
import { Spotlight } from "@/components/ui/spotlight";
import { PremiumButton } from "@/components/PremiumButton";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import ImageSlider from "@/components/ImageSlider";
import CompanyInterviewLanding from "@/components/companies";




// Mock BackgroundLines component since it's not available 
const BackgroundLines = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);


// Mock Button component
const Button = ({ onClick, size, className, children, onMouseEnter, onMouseLeave, variant }) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`px-4 py-2 rounded font-medium transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

// Mock Badge component
const Badge = ({ variant, className, children }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default function HeroSectionOne() {

  const router = useRouter();
  const { user, loading } = useUser();



  const onDashboard = () => {

    console.log("ondashboard cliked");

    if (loading) {
      console.log("loading fetching");
      return; // wait till user is ready
    }

    if (!user) {
      router.push("/auth");
    } else {
      router.push("/dashboard");
    }





  };

  return (
    <>

      <div className="min-h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] relative flex items-center justify-center py-8 overflow-hidden">
        <Spotlight
          className="-top-20 left-0 sm:-top-40 sm:left-0 md:left-60 md:-top-20"
          fill="white"
        />

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none"></div>


        <Navbar onDashboard={onDashboard} />

        <div className="p-4 max-w-7xl mx-auto relative z-10 w-full text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text text-transparent inline-block">
              Your Personal AI Job Recruiter
            </span>
          </h1>

          <p className="mt-6 font-normal text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed px-4">
            Connect, collaborate and celebrate from anywhere with Toking Allvez. Secure, reliable, and easy to use video conferencing solution.
          </p>

          {/* Premium action buttons */}


          <div className="mt-10 flex gap-4 justify-center flex-wrap px-4">
            <PremiumButton variant="fill" label="Start Interview" onClick={onDashboard} />
            <HoverBorderGradient children={"Learn More"} />




          </div>



        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/[0.96] to-transparent pointer-events-none"></div>



      </div>
      <div className="bg-black">
        <ImageSlider />

      </div>

      <div>

        <CompanyInterviewLanding />
      </div>

    </>
  );



}

