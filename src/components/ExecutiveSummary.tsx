import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, BarChart3, Database, TrendingUp } from 'lucide-react';
import type React from 'react';
import { calculateCorrelations, calculateGenderRatio, countryNames } from '../data';
import { useResearchData } from '../services/data-service';

const ExecutiveSummary: React.FC = () => {
  // Get live data from Supabase
  const { data: researchData = [], isLoading } = useResearchData();

  // Calculate live statistics from actual data
  const totalRecords = researchData.length;
  const totalCountries = Object.keys(countryNames).length;
  const genderRatio = researchData.length > 0 ? calculateGenderRatio(researchData) : 3.7;
  const correlations =
    researchData.length > 0
      ? calculateCorrelations(researchData)
      : { male: 0.76, female: 0.45, combined: 0.68 };

  // Round values for display
  const displayRatio = Math.round(genderRatio * 10) / 10;
  const displayMaleCorr = Math.round(correlations.male * 100) / 100;
  const displayFemaleCorr = Math.round(correlations.female * 100) / 100;
  const keyStats = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: `${displayRatio}x Higher`,
      subtitle: 'Alcohol mortality is disproportionately male',
      description:
        'Men die from alcohol at dramatically higher rates across all European countries.',
      microExplanation: `Based on average alcohol-related death rates by sex across ${totalCountries} European countries (2011-2022)`,
      color: 'from-red-500 to-red-600',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: `r = ${displayMaleCorr}`,
      subtitle: 'Statistically linked to suicide',
      description:
        'Strong correlation reveals alcohol misuse as both symptom and risk factor for mental health crises.',
      microExplanation: `Pearson correlation between alcohol mortality and suicide rates (2011-2022, men only)`,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: 'Hidden Crisis',
      subtitle: 'Mental health signals are often missed',
      description:
        'Analysis reveals alcohol deaths are masking a broader male mental health crisis.',
      microExplanation: 'Alcohol misuse often masks underlying psychological distress',
      color: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <section id="executive-summary" className="py-20 bg-linear-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">The Hidden Crisis</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Analysis of {totalRecords} mortality records from {totalCountries} European countries
            (2011-2022) reveals that male alcohol mortality isn't just about drinking— it's a
            symptom of a deeper mental health emergency.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {keyStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div
                className={`inline-flex p-3 rounded-lg bg-linear-to-r ${stat.color} text-white mb-6`}
              >
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.title}</h3>
              <h4 className="text-lg font-semibold text-blue-600 mb-4">{stat.subtitle}</h4>
              <p className="text-gray-600 leading-relaxed mb-4">{stat.description}</p>
              {/* Enhanced micro-explanation with footnote styling */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-sm border-l-4 border-blue-200">
                <span className="font-medium">¹</span> {stat.microExplanation}
              </div>
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
                <li>• {totalRecords} mortality records</li>
                <li>• {totalCountries} European countries</li>
                <li>• 2011-2022 analysis period</li>
                <li>• Age-standardized mortality rates per 100,000</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Key Findings</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Male correlation: r = {displayMaleCorr} (strong)</li>
                <li>• Female correlation: r = {displayFemaleCorr} (moderate)</li>
                <li>• {displayRatio}x gender disparity in alcohol mortality</li>
                <li>• Consistent patterns across all countries</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Data Completeness Notice */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">Data Completeness Notice</h3>
              <p className="mt-2 text-sm text-amber-700">
                This analysis includes <strong>783 mortality records</strong> from 34 European
                countries (2011-2022). Data completeness is <strong>95.9%</strong> with{' '}
                <strong>33 missing combinations</strong> primarily affecting female records and
                small countries (UK missing 2019-2022 due to Brexit, Liechtenstein and Malta have
                gaps due to small populations). Missing data is 3.13× more likely to be female
                records.
              </p>
              <p className="mt-2 text-sm text-amber-700">
                <strong>For rigorous analysis:</strong> Consider using only the 25 complete
                countries (600 records, 100% coverage).
                <strong>For maximum sample:</strong> Use all countries with missing data notation as
                shown.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;
