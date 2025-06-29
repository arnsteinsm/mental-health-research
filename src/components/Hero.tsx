import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Users, Target, TrendingUp } from 'lucide-react';
import { CORRECTED_DISPLAY } from '../data/actual-dataset-verification';

const Hero: React.FC = () => {
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
          {/* 1. ENGAGING YET SENSITIVE OPENING - Hope-focused, not mortality-led */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-6 py-3 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm font-medium mb-8">
              <Heart className="w-4 h-4 mr-2" />
              Public Health Challenge • Evidence-Based Solutions Available
            </div>
          </motion.div>

          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Behind the Drink
          </motion.h1>
          
          <motion.div
            className="text-2xl md:text-3xl text-purple-200 mb-12 leading-relaxed font-medium space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-3xl md:text-4xl">Men across Europe need our attention.</p>
            <p className="text-xl md:text-2xl text-yellow-300">
              What looks like drinking problems are often mental health crises in disguise.
            </p>
            <p className="text-lg md:text-xl text-blue-200">
              The data shows us the problem—and points to solutions that work.
            </p>
          </motion.div>

          {/* Quick Impact Stats - Visual Hierarchy */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-red-300 mb-4 mx-auto" />
              <div className="text-3xl font-bold text-red-300 mb-2">{CORRECTED_DISPLAY.genderRatio}x Higher</div>
              <div className="text-sm text-purple-200">Male alcohol mortality rate</div>
              <div className="text-xs text-purple-300 mt-2">Nearly four times women's rate</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <div className="text-3xl font-bold text-blue-300 mb-2">74% vs 31%</div>
              <div className="text-sm text-purple-200">Alcohol in male vs female suicide</div>
              <div className="text-xs text-purple-300 mt-2">Clear gender-specific pattern</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Target className="w-8 h-8 text-green-300 mb-4 mx-auto" />
              <div className="text-3xl font-bold text-green-300 mb-2">25% Reduction</div>
              <div className="text-sm text-purple-200">With targeted programs</div>
              <div className="text-xs text-purple-300 mt-2">Proven intervention success</div>
            </div>
          </motion.div>

          {/* Clear Calls to Action - Solution-focused */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <button
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-lg"
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Target className="w-5 h-5 mr-2" />
              See What Works
            </button>
            <button
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-lg"
              onClick={() => document.getElementById('data-insights')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore the Evidence
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>

          {/* Hope-Centered Impact Statement */}
          <motion.div
            className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-green-300 font-semibold text-lg">Evidence for Change</span>
            </div>
            <p className="text-xl leading-relaxed mb-4">
              Analysis of {CORRECTED_DISPLAY.totalRecords} health records from {CORRECTED_DISPLAY.countries} countries 
              reveals that targeted mental health interventions can reduce both alcohol-related deaths and suicides by up to 25%.
            </p>
            <div className="text-lg text-blue-200">
              <strong>The opportunity:</strong> Countries with male-focused mental health programs show measurable improvements
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;