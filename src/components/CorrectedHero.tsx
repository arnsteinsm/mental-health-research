import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, Database } from 'lucide-react';
import { verifiedStats } from '../data/data-verification';

const CorrectedHero: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
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
            European Health Data Exploration
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Preliminary Analysis of Alcohol and Suicide Mortality (2011-2018)
          </motion.p>

          <motion.div
            className="text-sm text-purple-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {verifiedStats.uniqueCountries.length} European countries • {verifiedStats.totalDataPoints} data points • {verifiedStats.uniqueYears.length}-year period ({verifiedStats.uniqueYears[0]}-{verifiedStats.uniqueYears[verifiedStats.uniqueYears.length - 1]})
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Database className="w-8 h-8 text-purple-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Limited Dataset</h3>
              <p className="text-purple-200 text-sm">Preliminary exploration with available European health data</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-blue-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Exploratory Analysis</h3>
              <p className="text-purple-200 text-sm">Initial patterns in mortality data across European countries</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-green-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Gender Differences</h3>
              <p className="text-purple-200 text-sm">Observable disparities in mortality rates between men and women</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <AlertTriangle className="w-8 h-8 text-red-300 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Data Limitations</h3>
              <p className="text-purple-200 text-sm">Incomplete temporal coverage limits statistical conclusions</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-amber-600/20 to-red-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-300">Data Integrity Notice</h2>
            <p className="text-lg leading-relaxed mb-4">
              This analysis represents a preliminary exploration of available European health data. 
              The dataset contains {verifiedStats.totalDataPoints} records from {verifiedStats.uniqueCountries.length} countries, 
              primarily from 2011 with limited temporal coverage.
            </p>
            <div className="text-sm text-purple-200">
              <strong>Important:</strong> Statistical correlations and trend analyses require more comprehensive longitudinal data than currently available.
            </div>
          </motion.div>

          <motion.button
            className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            onClick={() => document.getElementById('data-integrity')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Data Analysis
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CorrectedHero;