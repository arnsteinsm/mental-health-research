import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, Database } from 'lucide-react';
import { decadeStats, calculateDecadeGenderRatio, calculateDecadeCorrelations } from '../data/decade-research-data';

const Hero: React.FC = () => {
  const genderRatio = calculateDecadeGenderRatio();
  const correlations = calculateDecadeCorrelations();

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
            Men are dying from alcohol at {genderRatio.toFixed(1)}x the rate of women.<br/>
            This isn't just about drinking—it's about mental health.
          </motion.p>

          {/* Key Statistics Grid */}
          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Database className="w-8 h-8 text-purple-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Full Decade</h3>
              <p className="text-purple-200 text-sm">2013-2022 comprehensive analysis across {decadeStats.uniqueCountries.length} countries</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Strong Correlation</h3>
              <p className="text-purple-200 text-sm">r = {correlations.male.toFixed(2)} between alcohol deaths and suicide in men</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-green-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Gender Disparity</h3>
              <p className="text-purple-200 text-sm">{genderRatio.toFixed(1)}x higher male alcohol mortality reveals hidden crisis</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <AlertTriangle className="w-8 h-8 text-red-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Mental Health Link</h3>
              <p className="text-purple-200 text-sm">Alcohol misuse masks deeper psychological struggles</p>
            </div>
          </motion.div>

          {/* Key Finding Block */}
          <motion.div
            className="bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">10-Year Analysis Reveals</h2>
            <p className="text-lg leading-relaxed mb-4">
              Across a full decade (2013-2022), the pattern is unmistakable: where alcohol deaths rise, 
              suicide rates follow—especially among men. This stark correlation (r = {correlations.male.toFixed(2)}) 
              reveals that alcohol misuse is not merely substance abuse, but a symptom of deeper mental health vulnerabilities.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-300">{genderRatio.toFixed(1)}x</div>
                <div className="text-purple-200">Higher male alcohol mortality</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-300">r = {correlations.male.toFixed(2)}</div>
                <div className="text-purple-200">Alcohol-suicide correlation (men)</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-300">10 Years</div>
                <div className="text-purple-200">Comprehensive longitudinal study</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
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