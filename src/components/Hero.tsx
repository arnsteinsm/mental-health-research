// src/components/Hero.tsx

import { motion } from 'framer-motion';
import type React from 'react';
import { calculateGenderRatio, datasetStats } from '../data';
import { useResearchData } from '../services/data-service';

const Hero: React.FC = () => {
  // Get live data from the data service
  const { data: researchData = [] } = useResearchData();

  // Calculate live gender ratio from actual data
  const genderRatio =
    researchData.length > 0
      ? calculateGenderRatio(researchData)
      : datasetStats.genderRatios.averageRatio;
  const displayRatio = Math.round(genderRatio * 10) / 10; // Round to 1 decimal

  return (
    <section className="relative min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      </div>

      {/* Hero Image Integration */}
      <div className="absolute inset-0 opacity-20">
        <img
          src="/samane-mohammadi-nDXIGamTumY-unsplash.jpg"
          alt="Silhouette representing mental health struggles"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
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
            Alcohol-related deaths reveal a hidden mental health crisis, especially among men.
            <br />
            <span className="text-yellow-300">
              Men are dying at {displayRatio}x the rate of women.
            </span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button
              type="button"
              className="bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() =>
                document.getElementById('visualization')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore the Data
            </button>
            <button
              type="button"
              className="bg-white/10 backdrop-blur-xs border border-white/20 text-white font-semibold py-4 px-8 rounded-full hover:bg-white/20 transition-all duration-300"
              onClick={() =>
                document.getElementById('conclusions')?.scrollIntoView({ behavior: 'smooth' })
              }
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
