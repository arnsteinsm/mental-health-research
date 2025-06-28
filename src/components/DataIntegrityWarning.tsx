import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Database, Calendar, TrendingDown } from 'lucide-react';
import { verifiedStats, factCheckResults } from '../data/data-verification';

const DataIntegrityWarning: React.FC = () => {
  return (
    <section className="py-12 bg-red-50 border-t-4 border-red-500">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg border border-red-200">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-red-900">Data Integrity Notice</h2>
            </div>

            <div className="space-y-6">
              {/* Verified Dataset Facts */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Verified Dataset Facts
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Total Data Points:</strong> {verifiedStats.totalDataPoints}
                  </div>
                  <div>
                    <strong>Countries:</strong> {verifiedStats.uniqueCountries.length} (excluding EU average)
                  </div>
                  <div>
                    <strong>Year Range:</strong> {verifiedStats.uniqueYears[0]} - {verifiedStats.uniqueYears[verifiedStats.uniqueYears.length - 1]}
                  </div>
                  <div>
                    <strong>Gender Split:</strong> {verifiedStats.genderSplit.male}M / {verifiedStats.genderSplit.female}F
                  </div>
                </div>
              </div>

              {/* Critical Corrections */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Critical Corrections Required
                </h3>
                <div className="space-y-4">
                  {factCheckResults.corrections.map((correction, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-4">
                      <div className="font-semibold text-red-800">❌ Claim: "{correction.claim}"</div>
                      <div className="text-red-700">✅ Reality: {correction.reality}</div>
                      <div className="text-xs text-red-600 mt-1">Evidence: {correction.evidence}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Limitations */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Data Limitations
                </h3>
                <ul className="space-y-2 text-sm text-amber-800">
                  {factCheckResults.missingData.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      {limitation}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Statistical Impossibilities */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">Statistical Analysis Limitations</h3>
                <ul className="space-y-2 text-sm text-purple-800">
                  {factCheckResults.impossibleClaims.map((claim, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2">⚠️</span>
                      {claim}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Recommendation</h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  This analysis should be reframed as a <strong>preliminary exploration</strong> of European health data 
                  from 2011-2018, focusing on {verifiedStats.uniqueCountries.length} countries with available data. 
                  Claims about correlations, trends, and longitudinal analysis should be removed or significantly 
                  qualified until a complete dataset is available.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataIntegrityWarning;