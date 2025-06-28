import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { researchData } from '../data/research-data';

const Hero: React.FC = () => {
  // Calculate actual country count from data (excluding EU average)
  const countryCount = Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020').length;

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      </div>
      
      {/* Hero Image Integration */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="/samane-mohammadi-nDXIGamTumY-unsplash.jpg" 
          alt="Silhouette representing mental health struggles" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Behind the Drink
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-purple-200 mb-12 leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Men are dying from alcohol at 3.7x the rate of women.<br/>
            This isn't just about drinking—it's about mental health.
          </motion.p>

          {/* TL;DR Block */}
          <motion.div
            className="bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-xl font-bold text-yellow-300">Key Finding</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-300 mb-2">3.7x</div>
                <div className="text-sm text-purple-200">Higher male alcohol mortality across {countryCount} European countries</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-300 mb-2">r = 0.76</div>
                <div className="text-sm text-purple-200">Strong correlation between alcohol deaths and suicide in men</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-300 mb-2">8 Years</div>
                <div className="text-sm text-purple-200">Comprehensive analysis revealing hidden mental health crisis</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => document.getElementById('visualization')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore the Data
            </button>
            <button
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300"
              onClick={() => document.getElementById('conclusions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Jump to Solutions
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;