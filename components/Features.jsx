"use client"
import { Brain, Clock, FileText, Users, Target, Zap, TrendingUp, Award, Briefcase, MessageSquare, BarChart, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-Powered Question Generation",
    description: "Get intelligent questions tailored to your specific job position and role requirements.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "Position-Based Interviews",
    description: "Customized interview experiences based on job titles, roles, and industry requirements.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Time Management",
    description: "Built-in timer and scheduling to help you practice under real interview conditions.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Resume-Based Questions",
    description: "Upload your resume and get personalized questions based on your experience and skills.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Technical Interviews",
    description: "Practice coding challenges, system design, and technical problem-solving questions.",
    gradient: "from-indigo-500 to-blue-500"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Behavioral Interviews",
    description: "Master STAR method with AI-guided behavioral and situational questions.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Resume Booster",
    description: "Get AI-powered suggestions to improve your resume and increase interview callbacks.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: <BarChart className="w-8 h-8" />,
    title: "Performance Analytics",
    description: "Track your progress with detailed insights and improvement recommendations.",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "100% Free",
    description: "Access all premium features completely free. No hidden charges or subscriptions.",
    gradient: "from-violet-500 to-purple-500"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Industry-Specific",
    description: "Tailored questions for Tech, Finance, Healthcare, Marketing, and more industries.",
    gradient: "from-teal-500 to-green-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Real-time Feedback",
    description: "Get instant AI feedback on your answers to improve your interview skills.",
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared. Practice interviews with complete privacy.",
    gradient: "from-slate-500 to-gray-500"
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-black relative py-20">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text text-transparent mb-4">
            Powerful Features
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to ace your next interview with AI-powered preparation
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative h-full p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10">
                {/* Icon with gradient */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-300 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
