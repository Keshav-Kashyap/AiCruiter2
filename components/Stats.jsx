"use client"
import { motion } from "framer-motion";
import { Users, Briefcase, Star, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    value: "10,000+",
    label: "Active Users"
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    value: "50+",
    label: "Job Positions"
  },
  {
    icon: <Star className="w-8 h-8" />,
    value: "4.9/5",
    label: "User Rating"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "95%",
    label: "Success Rate"
  }
];

export default function Stats() {
  return (
    <section className="py-12 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-neutral-900/50 rounded-2xl p-8 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 text-center"
            >
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors mb-6 mx-auto">
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-neutral-400 text-sm md:text-base">
                {stat.label}
              </div>

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
