"use client"
import { motion } from "framer-motion";
import { Users, Briefcase, Star, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "10,000+",
    label: "Active Users",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    value: "50+",
    label: "Job Positions",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: <Star className="w-8 h-8" />,
    value: "4.9/5",
    label: "User Rating",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "95%",
    label: "Success Rate",
    gradient: "from-green-500 to-emerald-500"
  }
];

export default function Stats() {
  return (
    <div className="w-full bg-black py-16 px-4 relative">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-300 group-hover:bg-clip-text transition-all duration-300">
                {stat.value}
              </div>
              <div className="text-neutral-400 text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
