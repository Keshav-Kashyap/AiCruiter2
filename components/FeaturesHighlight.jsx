"use client"
import { Brain, Clock, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

const highlights = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered",
    description: "Smart question generation",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Position-Based",
    description: "Customized for your role",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Time Management",
    description: "Real interview conditions",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "100% Free",
    description: "All features included",
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function FeaturesHighlight() {
  return (
    <div className="w-full bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 backdrop-blur-sm text-center hover:shadow-xl hover:shadow-purple-500/10">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.gradient} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-sm">
                  {item.description}
                </p>

                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
