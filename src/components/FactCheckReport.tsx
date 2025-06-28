import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Database, TrendingUp, Users } from 'lucide-react';
import { researchData } from '../data/research-data';

const FactCheckReport: React.FC = () => {
  // ACTUAL DATASET ANALYSIS
  const actualStats = {
    totalRecords: researchData.length,
    uniqueCountries: Array.from(new Set(researchData.map(d => d.country))).filter(c => c !== 'EU27_2020'),
    uniqueYears: Array.from(new Set(researchData.map(d => d.year))).sort(),
    genderSplit: {
      male: researchData.filter(d => d.sex === 'M').length,
      female: researchData.filter(d => d.sex === 'F').length
    }
  };

  // VERIFIED CLAIMS
  const verifiedClaims = [
    {
      claim: "Dataset contains European health mortality data",
      status: "verified",
      evidence: `${actualStats.totalRecords} data points from European countries`
    },
    {
      claim: "Data is gender-stratified",
      status: "verified", 
      evidence: `${actualStats.genderSplit.male} male records, ${actualStats.genderSplit.female} female records`
    },
    {
      claim: "Includes alcohol-related mortality rates",
      status: "verified",
      evidence: "All records contain alcohol_rate field with age-standardized data"
    },
    {
      claim: "Includes suicide mortality rates", 
      status: "verified",
      evidence: "All records contain suicide_rate field with age-standardized data"
    }
  ];

  // CLAIMS REQUIRING MAJOR CORRECTIONS
  const incorrectClaims = [
    {
      claim: "Analysis covers 32 European countries",
      reality: `Dataset contains ${actualStats.uniqueCountries.length} countries`,
      evidence: `Countries: ${actualStats.uniqueCountries.join(', ')}`,
      severity: "critical"
    },
    {
      claim: "10-year longitudinal study (2013-2022)",
      reality: `Data spans ${actualStats.uniqueYears.length} years (${actualStats.uniqueYears[0]}-${actualStats.uniqueYears[actualStats.uniqueYears.length - 1]})`,
      evidence: `Years available: ${actualStats.uniqueYears.join(', ')}`,
      severity: "critical"
    },
    {
      claim: "Strong correlation r=0.76 between alcohol and suicide mortality",
      reality: "Correlation cannot be calculated with current limited dataset",
      evidence: "Most countries have only single data points, preventing meaningful correlation analysis",
      severity: "critical"
    },
    {
      claim: "Time series analysis showing trends",
      reality: "Time series analysis not possible with mostly single-year data",
      evidence: "Only Austria has multiple years of data (2011-2018), others mostly 2011 only",
      severity: "critical"
    }
  ];

  // DATA COVERAGE ANALYSIS
  const coverageAnalysis = (() => {
    const countryYearCounts = actualStats.uniqueCountries.reduce((acc, country) => {
      const countryData = researchData.filter(d => d.country === country);
      const years = Array.from(new Set(countryData.map(d => d.year)));
      acc[country] = years.length;
      return acc;
    }, {} as Record<string, number>);

    return {
      singleYearCountries: Object.entries(countryYearCounts).filter(([_, count]) => count === 1).length,
      multiYearCountries: Object.entries(countryYearCounts).filter(([_, count]) => count > 1).length,
      maxYearsPerCountry: Math.max(...Object.values(countryYearCounts)),
      avgYearsPerCountry: Object.values(countryYearCounts).reduce((a, b) => a + b, 0) / actualStats.uniqueCountries.length
    };
  })();

  // STATISTICAL LIMITATIONS
  const statisticalLimitations = [
    "Correlation analysis requires multiple data points per country - current dataset mostly has single years",
    "Trend analysis impossible with limited temporal coverage",
    "Cross-country comparisons limited by different year coverage",
    "Sample size too small for robust statistical inference",
    "No control for confounding variables due to limited data dimensions"
  ];

  // WHAT CAN BE VALIDLY CLAIMED
  const validClaims = [
    `Exploratory analysis of ${actualStats.uniqueCountries.length} European countries`,
    `Gender disparities observable in available data points`,
    `Lithuania shows highest male alcohol mortality in 2011 data`,
    `Preliminary patterns suggest higher male mortality rates across metrics`,
    `Dataset suitable for descriptive statistics, not inferential analysis`
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Fact-Check Report
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Comprehensive verification of all claims against the actual BigQuery dataset
          </p>
        </motion.div>

        {/* Dataset Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
            <Database className="w-6 h-6 mr-3" />
            Actual Dataset Facts
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{actualStats.totalRecords}</div>
              <div className="text-sm text-blue-800">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{actualStats.uniqueCountries.length}</div>
              <div className="text-sm text-blue-800">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{actualStats.uniqueYears.length}</div>
              <div className="text-sm text-blue-800">Years Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{coverageAnalysis.avgYearsPerCountry.toFixed(1)}</div>
              <div className="text-sm text-blue-800">Avg Years/Country</div>
            </div>
          </div>
        </motion.div>

        {/* Verified Claims */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3" />
            Verified Claims ✅
          </h3>
          <div className="space-y-4">
            {verifiedClaims.map((claim, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-green-800">{claim.claim}</div>
                  <div className="text-sm text-green-700">{claim.evidence}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Critical Corrections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-red-50 border border-red-200 rounded-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
            <XCircle className="w-6 h-6 mr-3" />
            Critical Corrections Required ❌
          </h3>
          <div className="space-y-6">
            {incorrectClaims.map((claim, index) => (
              <div key={index} className="border-l-4 border-red-400 pl-6">
                <div className="font-semibold text-red-800 mb-2">
                  ❌ Incorrect: "{claim.claim}"
                </div>
                <div className="text-red-700 mb-2">
                  ✅ Reality: {claim.reality}
                </div>
                <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
                  <strong>Evidence:</strong> {claim.evidence}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Coverage Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3" />
            Data Coverage Limitations
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-amber-800 mb-3">Temporal Coverage</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• {coverageAnalysis.singleYearCountries} countries have only 1 year of data</li>
                <li>• {coverageAnalysis.multiYearCountries} countries have multiple years</li>
                <li>• Maximum {coverageAnalysis.maxYearsPerCountry} years for any single country</li>
                <li>• Average {coverageAnalysis.avgYearsPerCountry.toFixed(1)} years per country</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-3">Statistical Implications</h4>
              <ul className="space-y-2 text-sm text-amber-700">
                {statisticalLimitations.map((limitation, index) => (
                  <li key={index}>• {limitation}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* What Can Be Validly Claimed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-purple-50 border border-purple-200 rounded-xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3" />
            What Can Be Validly Claimed
          </h3>
          <div className="space-y-3">
            {validClaims.map((claim, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-purple-800">{claim}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-900 text-white rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-yellow-400" />
            Recommendations for Accurate Presentation
          </h3>
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">1. Reframe as Exploratory Analysis:</strong> Present this as a preliminary 
              exploration of available European health data, not a comprehensive longitudinal study.
            </p>
            <p>
              <strong className="text-white">2. Accurate Dataset Description:</strong> "{actualStats.uniqueCountries.length} European countries, 
              {actualStats.totalRecords} data points, {actualStats.uniqueYears[0]}-{actualStats.uniqueYears[actualStats.uniqueYears.length - 1]} period"
            </p>
            <p>
              <strong className="text-white">3. Remove Statistical Claims:</strong> Eliminate correlation coefficients, 
              trend analyses, and longitudinal conclusions until complete dataset is available.
            </p>
            <p>
              <strong className="text-white">4. Focus on Descriptive Patterns:</strong> Highlight observable gender 
              disparities and country differences without inferential statistics.
            </p>
            <p>
              <strong className="text-white">5. Acknowledge Limitations:</strong> Clearly state data limitations and 
              the preliminary nature of findings throughout the presentation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FactCheckReport;