"use client"
import { motion } from "framer-motion";
import { UserPlus, Target, Play, MessageSquare, BarChart3, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <UserPlus className="w-8 h-8" />,
    title: "Create Your Account",
    description: "Sign up for free in seconds. No credit card required. Start your journey to interview success.",
    image: "/step1.png", // Placeholder - you can update this
    gradient: "from-blue-500 to-cyan-500",
    delay: 0.1
  },

  {
    number: "02",
    icon: <Target className="w-8 h-8" />,
    title: "Select on Video Call ",
    description: "Select your target job role, company, and interview type. We'll customize questions accordingly.",
    image: "/step2.png", // Placeholder - you can update this
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    number: "03",
    icon: <Target className="w-8 h-8" />,
    title: "Choose Your Position",
    description: "Select your target job role, company, and interview type. We'll customize questions accordingly.",
    image: "/step2.png", // Placeholder - you can update this
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    number: "04",
    icon: <Play className="w-8 h-8" />,
    title: "Start AI Interview",
    description: "Begin your practice session with AI-powered questions tailored to your position and experience.",
    image: "/step3.png", // Placeholder - you can update this
    gradient: "from-orange-500 to-red-500",
    delay: 0.3
  },
  {
    number: "05",
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Get Real-time Feedback",
    description: "Receive instant AI feedback on your answers, communication skills, and technical knowledge.",
    image: "/step4.png", // Placeholder - you can update this
    gradient: "from-green-500 to-emerald-500",
    delay: 0.4
  },
  {
    number: "06",
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Review Performance",
    description: "Analyze detailed insights, strengths, and areas for improvement with comprehensive analytics.",
    image: "/step5.png", // Placeholder - you can update this
    gradient: "from-indigo-500 to-blue-500",
    delay: 0.5
  },
  {
    number: "07",
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Improve & Succeed",
    description: "Practice repeatedly with new questions, track progress, and ace your real interview with confidence.",
    image: "/step6.png", // Placeholder - you can update this
    gradient: "from-pink-500 to-rose-500",
    delay: 0.6
  }
];

export default function HowItWorks() {
  return (
    <div className="w-full bg-black py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-500/5 to-black" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
            <span className="text-sm text-purple-300 font-medium">Simple Process</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text text-transparent mb-6">
            How Interview Works
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Get started in minutes and master your interview skills with our AI-powered platform
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: step.delay }}
              viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Side */}
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="relative">
                  {/* Step Number */}
                  <div className={`inline-block text-8xl md:text-9xl font-bold bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-20 absolute -top-8 -left-4`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.gradient} mb-6 relative z-10`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 text-lg leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Step indicator */}
                  <div className="flex items-center gap-3">
                    <div className={`h-1 w-16 rounded-full bg-gradient-to-r ${step.gradient}`} />
                    <span className="text-sm text-neutral-500">Step {step.number}</span>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative group">
                  {/* Image Container with gradient border */}
                  <div className="relative rounded-2xl overflow-hidden bg-neutral-900/50 border border-neutral-800 p-1 group-hover:border-neutral-700 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Placeholder for image - Update these paths */}
                    <div className="relative aspect-video rounded-xl bg-neutral-900 flex items-center justify-center overflow-hidden">
                      {/* Placeholder - you'll replace this with actual image */}
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="flex flex-col items-center justify-center gap-4 p-12">
                              <div class="w-20 h-20 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center">
                                ${step.icon}
                              </div>
                              <p class="text-neutral-500 text-center">Image Placeholder<br/><span class="text-xs">${step.image}</span></p>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${step.gradient} rounded-full blur-3xl opacity-20`} />
                  <div className={`absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-full blur-3xl opacity-20`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors cursor-pointer group">
            <span className="text-lg font-medium">Ready to get started?</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
