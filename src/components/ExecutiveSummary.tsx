import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertCircle, Database } from 'lucide-react';
import { CORRECTED_DISPLAY } from '../data/actual-dataset-verification';

const ExecutiveSummary: React.FC = () => {
  const keyStats = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: `${CORRECTED_DISPLAY.genderRatio}x Higher`,
      subtitle: "Alcohol mortality is disproportionately male",
      description: "Men die from alcohol at dramatically higher rates across all European countries.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: `r = ${CORRECTED_DISPLAY.maleCorrelation}`,
      subtitle: "Statistically linked to suicide",
      description: "Strong correlation reveals alcohol misuse as both symptom and risk factor for mental health crises.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "Hidden Crisis",
      subtitle: "Mental health signals are often missed",
      description: "Analysis reveals alcohol deaths are masking a broader male mental health crisis.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <section id="executive-summary" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Hidden Crisis
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Analysis of {CORRECTED_DISPLAY.totalRecords} data points from {CORRECTED_DISPLAY.countries} European countries 
            ({CORRECTED_DISPLAY.yearRange}) reveals that male alcohol mortality isn't just about drinking—
            it's a symptom of a deeper mental health emergency.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {keyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white mb-6`}>
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.title}
              </h3>
              <h4 className="text-lg font-semibold text-blue-600 mb-4">
                {stat.subtitle}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dataset Documentation - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
        >
          <div className="flex items-center mb-6">
            <Database className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Research Foundation</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Dataset Coverage</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {CORRECTED_DISPLAY.totalRecords} verified data points</li>
                <li>• {CORRECTED_DISPLAY.countries} European countries</li>
                <li>• {CORRECTED_DISPLAY.yearRange} analysis period</li>
                <li>• Age-standardized mortality rates per 100,000</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Key Findings</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Male correlation: r = {CORRECTED_DISPLAY.maleCorrelation} (strong)</li>
                <li>• Female correlation: r = {CORRECTED_DISPLAY.femaleCorrelation} (moderate)</li>
                <li>• {CORRECTED_DISPLAY.genderRatio}x gender disparity in alcohol mortality</li>
                <li>• Consistent patterns across all countries</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;