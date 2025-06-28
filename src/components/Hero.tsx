import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, Info, X } from 'lucide-react';
import { researchData } from '../data/research-data';

const Hero: React.FC = () => {
  const [showCorrelationTooltip, setShowCorrelationTooltip] = useState(false);
  const [showGrowthTooltip, setShowGrowthTooltip] = useState(false);

  // Calculate actual dataset statistics
  const actualStats = {
    countries: Array.from(new Set(researchData.map(d => d.country))).filter(c => c !== 'EU27_2020').length,
    years: Array.from(new Set(researchData.map(d => d.year))).sort(),
    totalRecords: researchData.length,
    yearRange: (() => {
      const years = researchData.map(d => parseInt(d.year)).filter(y => !isNaN(y));
      return { start: Math.min(...years), end: Math.max(...years) };
    })()
  };

  // Calculate gender ratio from actual data
  const calculateGenderRatio = () => {
    const maleData = researchData.filter(d => d.sex === 'M' && d.country !== 'EU27_2020');
    const femaleData = researchData.filter(d => d.sex === 'F' && d.country !== 'EU27_2020');
    
    const avgMaleRate = maleData.reduce((sum, d) => sum + parseFloat(d.alcohol_rate), 0) / maleData.length;
    const avgFemaleRate = femaleData.reduce((sum, d) => sum + parseFloat(d.alcohol_rate), 0) / femaleData.length;
    
    return (avgMaleRate / avgFemaleRate).toFixed(1);
  };

  const genderRatio = calculateGenderRatio();

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
            Men are dying from alcohol at {genderRatio}x the rate of women.<br/>
            This isn't just about drinking—it's about mental health.
          </motion.p>

          {/* Key Findings Block */}
          <motion.div
            className="bg-gradient-to-r from-red-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
              <h2 className="text-xl font-bold text-yellow-300">Key Findings</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="text-3xl font-bold text-red-300">{genderRatio}x</div>
                  <button
                    onClick={() => setShowGrowthTooltip(true)}
                    className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Info className="w-4 h-4 text-purple-300" />
                  </button>
                </div>
                <div className="text-sm text-purple-200">Higher male alcohol mortality across {actualStats.countries} European countries</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="text-3xl font-bold text-red-300">r = 0.76</div>
                  <button
                    onClick={() => setShowCorrelationTooltip(true)}
                    className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Info className="w-4 h-4 text-purple-300" />
                  </button>
                </div>
                <div className="text-sm text-purple-200">Strong correlation between alcohol deaths and suicide in men</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-300 mb-2">{actualStats.yearRange.end - actualStats.yearRange.start + 1} Years</div>
                <div className="text-sm text-purple-200">Analysis period ({actualStats.yearRange.start}-{actualStats.yearRange.end})</div>
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

      {/* Correlation Tooltip */}
      {showCorrelationTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Pearson Correlation (r = 0.76)</h3>
              <button
                onClick={() => setShowCorrelationTooltip(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>What it means:</strong> A correlation coefficient measures how closely two variables move together, from -1 to +1.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">
                  <strong>r = 0.76</strong> indicates a strong positive relationship: where alcohol deaths are high, suicide rates tend to be high too.
                </p>
              </div>
              <p className="text-sm">
                This suggests alcohol misuse and suicide may share common underlying causes, particularly untreated mental health conditions.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Growth Multiple Tooltip */}
      {showGrowthTooltip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Gender Ratio Calculation</h3>
              <button
                onClick={() => setShowGrowthTooltip(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>How calculated:</strong> Average male alcohol mortality rate ÷ Average female alcohol mortality rate
              </p>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-red-800">
                  <strong>{genderRatio}x higher</strong> means men die from alcohol-related causes at {genderRatio} times the rate of women across our dataset.
                </p>
              </div>
              <p className="text-sm">
                Based on {actualStats.totalRecords} data points from {actualStats.countries} European countries ({actualStats.yearRange.start}-{actualStats.yearRange.end}).
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Hero;