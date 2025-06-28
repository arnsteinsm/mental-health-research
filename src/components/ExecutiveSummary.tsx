import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertCircle, Database, ExternalLink, Target, Lightbulb } from 'lucide-react';
import { researchData } from '../data/research-data';

const ExecutiveSummary: React.FC = () => {
  // Calculate actual country count from data
  const countryCount = Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020').length;

  const keyFindings = [
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: "3.7x Higher Risk",
      subtitle: "Male alcohol mortality vs. female",
      insight: "Men consistently show dramatically higher alcohol-related death rates across all European countries.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Strong Correlation",
      subtitle: "r = 0.76 (alcohol-suicide link)",
      insight: "Where alcohol deaths rise, suicide rates follow—especially among men.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hidden Crisis",
      subtitle: "Mental health, not just addiction",
      insight: "Alcohol misuse serves as self-medication for untreated mental health conditions.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  const actionableInsights = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Target Male Mental Health",
      description: "Develop male-specific interventions addressing help-seeking barriers"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Reframe Treatment Approach",
      description: "Address underlying mental health, not just substance abuse"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Workplace Integration",
      description: "Implement mental health programs in male-dominated industries"
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
            The Crisis Revealed
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Analysis of {countryCount} European countries reveals a profound gender disparity 
            pointing to a critical mental health crisis affecting men.
          </p>
        </motion.div>

        {/* Key Findings - Visual Impact */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {keyFindings.map((finding, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${finding.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300`}>
                <div className="mb-6">
                  {finding.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {finding.title}
                </h3>
                <h4 className="text-lg font-semibold mb-4 opacity-90">
                  {finding.subtitle}
                </h4>
                <p className="text-sm leading-relaxed opacity-90">
                  {finding.insight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Research Question - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-16 border border-gray-100"
        >
          <div className="text-center">
            <Database className="w-12 h-12 text-purple-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Research Question</h3>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              How do alcohol-related mortality patterns reflect broader mental health vulnerabilities 
              across European men, and what does this reveal about societal support systems?
            </p>
          </div>
        </motion.div>

        {/* Actionable Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Immediate Action Points</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {actionableInsights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    {insight.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                </div>
                <p className="text-gray-600 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Transparency - Condensed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-6">Methodology & Data Sources</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Data Coverage</h4>
              <div className="text-purple-100 text-sm space-y-1">
                <div>• {countryCount} European countries</div>
                <div>• Age-standardized mortality rates</div>
                <div>• Gender-stratified analysis</div>
                <div>• Pearson correlation analysis</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Primary Sources</h4>
              <div className="text-purple-100 text-sm space-y-2">
                <a href="https://data.europa.eu/data/datasets/rep2namroxi8l8deyq15w" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Eurostat Alcohol Mortality
                </a>
                <a href="https://data.europa.eu/data/datasets/dvvny3x2o5wag4yfbrkmhq" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Eurostat Suicide Data
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;