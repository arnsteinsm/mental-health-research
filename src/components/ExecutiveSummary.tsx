import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertCircle, Database, ExternalLink } from 'lucide-react';
import { researchData } from '../data/research-data';

const ExecutiveSummary: React.FC = () => {
  // Calculate actual country count from data
  const countryCount = Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020').length;

  const keyStats = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "3.7x Higher",
      subtitle: "Male alcohol-related mortality rates",
      description: "Men consistently show significantly higher alcohol-related death rates across all European countries studied.",
      methodology: "Age-standardized death rates per 100,000 population (ICD-10: F10)"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "2.1x Higher",
      subtitle: "Male suicide rates",
      description: "The gender gap in suicide rates correlates strongly with alcohol misuse patterns.",
      methodology: "Age-standardized suicide death rates per 100,000 (ICD-10: X60–X84, Y870)"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "r = 0.76",
      subtitle: "Alcohol-Suicide Correlation (Men)",
      description: "Strong positive correlation between alcohol mortality and suicide rates among men across Europe.",
      methodology: "Pearson correlation coefficient measuring linear relationship strength"
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: `${countryCount} Countries`,
      subtitle: "10-Year Analysis",
      description: "Comprehensive longitudinal study covering 2013-2022 across diverse European contexts.",
      methodology: "Time-series analysis with standardized mortality rates for cross-country comparison"
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
            Executive Summary
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our analysis of European health data from 2013-2022 reveals profound gender disparities 
            in alcohol-related mortality and suicide rates, pointing to a critical mental health crisis 
            that disproportionately affects men.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {keyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="text-blue-600 mb-4">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {stat.title}
              </h3>
              <h4 className="text-lg font-semibold text-blue-600 mb-3">
                {stat.subtitle}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {stat.description}
              </p>
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <strong>Method:</strong> {stat.methodology}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Research Question */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-16 border border-gray-100"
        >
          <div className="flex items-center mb-6">
            <Database className="w-8 h-8 text-purple-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">Core Research Question</h3>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            How do alcohol-related mortality trends reflect broader patterns of mental health and societal risk — 
            particularly through a gendered lens — across Europe from 2013 to 2022?
          </p>
        </motion.div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Primary Data Sources & Methodology</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
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
          
          {/* Methodological Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h4 className="font-semibold text-amber-900 mb-3">Methodological Note</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
              While accident mortality data was collected for comprehensive analysis, it was excluded from primary 
              findings due to diverse causation factors beyond mental health and substance abuse. Accident rates 
              introduce significant confounding variables (workplace safety, traffic regulations, geographic factors) 
              that would dilute the focused mental health narrative. The complete dataset including accident rates 
              is available in the data table for transparency.
            </p>
          </div>
        </motion.div>

        {/* Statistical Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6">Statistical Methodology</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Correlation Analysis</h4>
              <p className="text-purple-100 text-sm mb-2">
                Pearson correlation coefficients measure linear relationships between alcohol and suicide mortality, 
                ranging from -1 (perfect negative) to +1 (perfect positive correlation).
              </p>
              <div className="text-xs text-purple-200">
                <strong>Results:</strong> Men r=0.76, Women r=0.49, Combined r=0.68
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Age Standardization</h4>
              <p className="text-purple-100 text-sm mb-2">
                All mortality rates are age-standardized per 100,000 population to enable 
                valid cross-country and temporal comparisons.
              </p>
              <div className="text-xs text-purple-200">
                <strong>Standard:</strong> European Standard Population
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Time Series Analysis</h4>
              <p className="text-purple-100 text-sm mb-2">
                10-year longitudinal analysis (2013-2022) captures trends and patterns 
                across diverse European socioeconomic contexts.
              </p>
              <div className="text-xs text-purple-200">
                <strong>Coverage:</strong> {countryCount} countries, gender-stratified
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;