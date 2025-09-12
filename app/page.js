
"use client"
import Navbar from "@/components/Navbar";
import { MoveRight, Sparkles, Users, Target, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "./provider";
import Loading from "@/components/Loading";
import { SparklesPreview } from "@/components/LandingHeroName";
import { SparklesPreviewbg } from "@/components/StarBackGround"
import { ContainerTextFlip } from "@/components/ui/ContainerTextFlip";



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

  const [isHovered, setIsHovered] = useState(false);
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

  const onDashboard = () => {

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

  if (loading) {
    return (



      <Loading loadingMessage={'Please Wait'} loadingDescription={'Data Fetching...'} />
    )
  }

  return (
  <>
  <SparklesPreviewbg>  
        <Navbar onDashboard={onDashboard} />


      <div className="relative z-10 px-4 py-20 max-w-6xl mt-20 mx-auto">



        {/* Main Heading */}
        {/* <div className="opacity-0 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h1 className="relative mx-auto max-w-5xl text-center text-4xl font-bold tracking-tight text-slate-100 md:text-6xl lg:text-7xl">
            Your Personal{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AI Interview Coach
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-full animate-scaleX" />
            </span>
          </h1>
        </div> */}

        <h2 className="text-center">
          <ContainerTextFlip
          words={[
            "Your Personal AI Recruiter",
            "Smarter Hiring Assistant",
            "Future of Recruitment",
            "Talent Matchmaker"
          ]}
        />
</h2>

        {/* Subtitle */}
        <p className="relative mx-auto max-w-2xl py-8 text-center text-lg font-normal leading-relaxed text-slate-300 md:text-xl opacity-0 animate-fadeInUp"
          style={{ animationDelay: '0.2s' }}>
          An intelligent platform that simulates real interviews, provides{" "}
          <span className="font-semibold text-blue-400">
            personalized feedback
          </span>
          , and equips you with the skills to land your dream job.
        </p>

        {/* Feature Icons */}
        <div className="flex justify-center gap-8 mb-12 opacity-0 animate-fadeInUp"
          style={{ animationDelay: '0.3s' }}>
          {[
            { icon: Users, label: "1000+ Users" },
            { icon: Target, label: "95% Success Rate" },
            { icon: Trophy, label: "Industry Leaders" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200"
              style={{
                animation: `float${index + 3} 3s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              <div className="p-3 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 shadow-lg">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-16 opacity-0 animate-fadeInUp"
          style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={onDashboard}
            size="lg"
            className="group relative h-14 w-64 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-semibold text-white shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-transform duration-300 ${isHovered ? 'translate-x-0' : '-translate-x-full'
                }`}
            />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Explore Now
              <MoveRight className={`w-5 h-5 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`} />
            </span>
          </Button>
        </div>

        {/* Image Slider */}
        <div className="relative mx-auto max-w-4xl opacity-0 animate-fadeInUp"
          style={{ animationDelay: '0.5s' }}>
          <div className="relative rounded-3xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm p-4 shadow-2xl shadow-slate-900/20 overflow-hidden">
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
      </div>

</SparklesPreviewbg>

   

   </>


  );
}

