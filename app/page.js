"use client"
import React, { useState } from 'react';
import { Play, Users, Calendar, Phone, CheckCircle, ArrowRight, Menu, X, Star, Zap, Target, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { supabase } from '@/services/supaBaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("user logged in");
      }
      else {
        console.log("not logged in");
      }

    };

    checkUser();
  }, []);


  const onDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);

    if (user) {
      router.push('/dashboard');
    }
    else {
      router.push('/auth');
    }

  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between gap-12  items-center h-16">



            <div className="flex items-center space-x-2">

              <Image src='/logo.png' alt='logo' width={130} height={130} />

            </div>

            <div className='hidden  md:flex items-center gap-7'>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>

              <Link href='/auth' className="text-gray-600 hover:text-blue-600 transition-colors">
                Sign In
              </Link>


            </div>


            <div className="hidden md:flex items-center space-x-8">

              <button onClick={() => onDashboard()} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Dashboard
              </button>




            </div>



            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-600">Features</a>
              <a href="#how-it-works" className="block py-2 text-gray-600">How It Works</a>
              <Link href='/auth' className="block py-2 text-gray-600" >
                Sign In
              </Link>

              <button onClick={() => onDashboard()} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
                Dashboard
              </button>

            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-center items-center h-full">
            <div className="space-y-8 w-[800px] text-center">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI-Driven Interviews,
                  <span className="text-blue-600"> Hassle-Free</span> Hiring
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your recruitment process with intelligent AI interviews that screen candidates efficiently and schedule seamlessly.
                </p>
              </div>

              <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">


                <button onClick={() => onDashboard()} className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5" />


                </button>

              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>5 min setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className=" py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Powerful Features for Modern Recruiting</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your hiring process and find the best candidates faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Interviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Create intelligent interviews that adapt to candidate responses and evaluate skills automatically.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatically schedule interviews and phone screening calls with candidates seamlessly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Candidate Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Track all candidates in one place with detailed profiles and interview history.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Precision Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms match candidates to roles based on skills, experience, and fit.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                Get started in just 5 minutes with our intuitive setup process and templates.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Get insights into your hiring process with comprehensive reports and metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to revolutionize your hiring process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Create Interview</h3>
              <p className="text-gray-600">
                Set up your AI interview with custom questions and evaluation criteria in minutes.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Share with Candidates</h3>
              <p className="text-gray-600">
                Send interview links to candidates or schedule phone screening calls automatically.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Review & Hire</h3>
              <p className="text-gray-600">
                Get AI-generated insights and make informed hiring decisions with detailed reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-4xl font-bold">10,000+</div>
              <div className="text-blue-100">Interviews Conducted</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">95%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">70%</div>
              <div className="text-blue-100">Time Saved</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-blue-100">Companies Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of companies already using AI Cruiter to find the best candidates faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onDashboard()} className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all hover:scale-105 flex items-center justify-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900  text-center text-gray-300 py-12">
        <p>&copy; 2025 AI Cruiter. All rights reserved.</p>




      </footer>
    </div>
  );
}