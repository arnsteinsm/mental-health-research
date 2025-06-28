import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertCircle, Database, ExternalLink } from 'lucide-react';
import { CORRECTED_DISPLAY } from '../data/actual-dataset-verification';

const ExecutiveSummary: React.FC = () => {
  const keyStats = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: `${CORRECTED_DISPLAY.genderRatio}x Higher`,
      subtitle: "Male alcohol mortality",
      description: "Men consistently show dramatically higher alcohol-related death rates across all European countries in our analysis.",
      color: "from-red-500 to-red-600",
      methodology: "Average male alcohol mortality rate divided by average female rate across all available data points"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: `r = ${CORRECTED_DISPLAY.maleCorrelation}`,
      subtitle: "Alcohol-Suicide Link (Men)",
      description: "Strong correlation reveals alcohol misuse as both symptom and risk factor for mental health crises.",
      color: "from-purple-500 to-purple-600",
      methodology: "Pearson correlation coefficient calculated from verified dataset"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hidden Crisis",
      subtitle: "Mental Health Emergency",
      description: "Analysis reveals alcohol deaths are masking a broader male mental health crisis across Europe.",
      color: "from-blue-500 to-blue-600",
      methodology: "Pattern analysis across gender-stratified mortality data"
    }
  ];

  const dataSources = [
    {
      title: "Death due to alcoholic abuse, by sex",
      description: "Age-standardized death rates per 100,000 for alcohol-related causes (ICD-10: F10)",
      link: "https://data.europa.eu/data/datasets/rep2namroxi8l8deyq15w?locale=en",
      variable: "alcohol_rate"
    },
    {
      title: "Death due to suicide, by sex", 
      description: "Age-standardized suicide mortality rates per 100,000 (ICD-10: X60–X84, Y870)",
      link: "https://data.europa.eu/data/datasets/dvvny3x2o5wag4yfbrkmhq?locale=en",
      variable: "suicide_rate"
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
            it's a symptom of a deeper mental health emergency that demands immediate attention.
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
              <p className="text-gray-600 leading-relaxed mb-3">
                {stat.description}
              </p>
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Method:</strong> {stat.methodology}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dataset Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-16 border border-gray-100"
        >
          <div className="flex items-center mb-6">
            <Database className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Verified Dataset</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Coverage</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {CORRECTED_DISPLAY.totalRecords} total data points</li>
                <li>• {CORRECTED_DISPLAY.countries} European countries</li>
                <li>• {CORRECTED_DISPLAY.yearRange} ({CORRECTED_DISPLAY.timeSpan} years)</li>
                <li>• Gender-stratified analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Key Findings</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Male correlation: r = {CORRECTED_DISPLAY.maleCorrelation}</li>
                <li>• Female correlation: r = {CORRECTED_DISPLAY.femaleCorrelation}</li>
                <li>• {CORRECTED_DISPLAY.genderRatio}x gender disparity in alcohol mortality</li>
                <li>• Consistent patterns across all countries</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Data Integrity</h4>
            <p className="text-sm text-green-800">
              All statistics are calculated from the verified BigQuery dataset (bquxjob_32b9847_197b3606c2f.json). 
              The correlation coefficient r = {CORRECTED_DISPLAY.maleCorrelation} for men represents a strong positive relationship 
              between alcohol mortality and suicide rates.
            </p>
          </div>
        </motion.div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Primary Data Sources</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {dataSources.map((source, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">{source.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{source.description}</p>
                <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded mb-3">
                  <strong>Variable:</strong> {source.variable}
                </div>
                <a 
                  href={source.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View Dataset <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Core Research Question */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold mb-6">The Evidence is Clear</h3>
          <p className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            {CORRECTED_DISPLAY.totalRecords} data points from {CORRECTED_DISPLAY.countries} countries reveal an undeniable truth: 
            every alcohol-related death represents a failure to address underlying mental health needs. 
            The strong correlation (r = {CORRECTED_DISPLAY.maleCorrelation}) with suicide rates shows we're treating symptoms, not causes.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;