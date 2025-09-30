import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const PopularCompanyInterviews = () => {
    const companies = [
        {
            name: 'Google',
            logo: 'https://cdn.simpleicons.org/google/white',
            category: 'Technology',
            interviews: '2,500+'
        },
        {
            name: 'Microsoft',
            logo: './microsoft.jpg',
            category: 'Software',
            interviews: '1,800+'
        },
        {
            name: 'Amazon',
            logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/amazon-white-icon.png',
            category: 'E-commerce',
            interviews: '2,200+'
        },
        {
            name: 'Meta',
            logo: 'https://cdn.simpleicons.org/meta/white',
            category: 'Social Media',
            interviews: '1,500+'
        },
        {
            name: 'Apple',
            logo: 'https://cdn.simpleicons.org/apple/white',
            category: 'Technology',
            interviews: '1,700+'
        },
        {
            name: 'Netflix',
            logo: 'https://cdn.simpleicons.org/netflix/white',
            category: 'Entertainment',
            interviews: '900+'
        },
        {
            name: 'Tesla',
            logo: 'https://cdn.simpleicons.org/tesla/white',
            category: 'Automotive',
            interviews: '1,100+'
        },
        {
            name: 'IBM',
            logo: './ibm.png',
            category: 'Technology',
            interviews: '1,300+'
        },
        {
            name: 'Samsung',
            logo: 'https://cdn.simpleicons.org/samsung/white',
            category: 'Electronics',
            interviews: '1,400+'
        },
        {
            name: 'Intel',
            logo: 'https://cdn.simpleicons.org/intel/white',
            category: 'Semiconductors',
            interviews: '1,000+'
        },
        {
            name: 'Adobe',
            logo: './adove.png',
            category: 'Software',
            interviews: '800+'
        },
        {
            name: 'Salesforce',
            logo: 'https://cdn.simpleicons.org/salesforce/white',
            category: 'Cloud',
            interviews: '950+'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <section className="py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20">
                            Top Companies
                        </Badge>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Top Company Interviews
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Prepare with AI-powered mock interviews for the world’s best companies.
                        </p>
                    </motion.div>
                </div>

                {/* Companies Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
                >
                    {companies.map((company, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -6 }}
                            className="group relative bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:from-white/10 hover:to-white/5 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-9 h-9 opacity-90"
                                    />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-white transition-all duration-300" />
                            </div>

                            <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors">
                                {company.name}
                            </h3>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{company.category}</span>
                                <Badge variant="secondary" className="text-xs bg-white/5 text-gray-400 border-white/10 hover:bg-white/10">
                                    {company.interviews}
                                </Badge>
                            </div>

                            {/* Hover Effect Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center"
                >

                </motion.div>
            </div>
        </section>
    );
};

export default PopularCompanyInterviews;