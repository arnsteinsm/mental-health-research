import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, Database } from 'lucide-react';
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
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Alcohol, Mental Health, and Societal Impact
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            A Gendered Lens on European Data (2013-2022)
          </motion.p>

          <motion.div
            className="text-sm text-purple-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Analysis of {countryCount} European countries • 3 core datasets • 10-year longitudinal study
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Database className="w-8 h-8 text-purple-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Comprehensive Data</h3>
              <p className="text-purple-200 text-sm">Age-standardized mortality rates from official Eurostat sources</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Decade Analysis</h3>
              <p className="text-purple-200 text-sm">10-year time series revealing evolving patterns and trends</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-green-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Gender Disparities</h3>
              <p className="text-purple-200 text-sm">Stark differences in mental health vulnerabilities by sex</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <AlertTriangle className="w-8 h-8 text-red-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Critical Correlations</h3>
              <p className="text-purple-200 text-sm">Strong statistical relationships between alcohol and suicide mortality</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">Key Finding</h2>
            <p className="text-lg leading-relaxed mb-4">
              "This stark disparity reveals that alcohol misuse is not merely a substance abuse issue but a reflection of deeper mental health vulnerabilities, particularly for men."
            </p>
            <div className="text-sm text-purple-200">
              <strong>Correlation Analysis:</strong> Men show r = 0.76 between alcohol and suicide mortality (strong positive correlation)
            </div>
          </motion.div>

          <motion.button
            className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={() => document.getElementById('executive-summary')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore the Research
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;