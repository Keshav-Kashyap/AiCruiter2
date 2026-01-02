"use client"
import { motion } from "framer-motion";
import { Code, MessageSquare, Zap, Users } from "lucide-react";

const interviewTypes = [
  {
    icon: <Code className="w-12 h-12" />,
    title: "Technical Interviews",
    description: "Master coding challenges, data structures, algorithms, and system design questions",
    features: ["Coding Problems", "System Design", "Database Questions", "API Design"],
    gradient: "from-blue-500 to-cyan-500",
    borderGradient: "from-blue-500/50 to-cyan-500/50"
  },
  {
    icon: <MessageSquare className="w-12 h-12" />,
    title: "Behavioral Interviews",
    description: "Perfect your STAR method responses and situational questions",
    features: ["STAR Method", "Leadership", "Team Work", "Conflict Resolution"],
    gradient: "from-purple-500 to-pink-500",
    borderGradient: "from-purple-500/50 to-pink-500/50"
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: "HR Round",
    description: "Practice common HR questions and salary negotiations",
    features: ["Career Goals", "Strengths/Weaknesses", "Salary Talk", "Work Culture"],
    gradient: "from-orange-500 to-red-500",
    borderGradient: "from-orange-500/50 to-red-500/50"
  },
  {
    icon: <Users className="w-12 h-12" />,
    title: "Case Interviews",
    description: "Tackle business cases and consulting-style problems",
    features: ["Market Sizing", "Business Strategy", "Problem Solving", "Analytics"],
    gradient: "from-green-500 to-emerald-500",
    borderGradient: "from-green-500/50 to-emerald-500/50"
  }
];

export default function InterviewTypes() {
  return (
    <div className="w-full bg-black py-20 px-4 relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-neutral-50 via-white/90 to-neutral-400 bg-clip-text text-transparent mb-4">
            All Types of Interviews
          </h2>
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto">
            Practice every interview format with AI-powered questions and feedback
          </p>
        </motion.div>

        {/* Interview Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {interviewTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm overflow-hidden">
                {/* Gradient border glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${type.borderGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${type.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {type.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {type.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 mb-6 leading-relaxed">
                    {type.description}
                  </p>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-3">
                    {type.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-neutral-300"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${type.gradient}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.gradient} opacity-5 blur-3xl rounded-full`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
