import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Database, BarChart3, TrendingUp } from 'lucide-react';
import { 
  actualStats, 
  countryCoverage, 
  calculateActualCorrelations, 
  extremeValues, 
  genderRatios,
  factCheckResults 
} from '../data/actual-dataset-analysis';

const ActualFactCheck: React.FC = () => {
  const [correlations, setCorrelations] = useState<any>(null);

  useEffect(() => {
    setCorrelations(calculateActualCorrelations());
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Actual Dataset Fact-Check
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Complete verification using the actual BigQuery dataset: bquxjob_32b9847_197b3606c2f.json
          </p>
        </motion.div>

        {/* Verified Dataset Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Database className="w-6 h-6 mr-3 text-blue-600" />
            Verified Dataset Facts
          </h3>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{actualStats.totalRecords}</div>
              <div className="text-sm text-blue-800">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{actualStats.uniqueCountries.length}</div>
              <div className="text-sm text-green-800">Countries</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{actualStats.uniqueYears.length}</div>
              <div className="text-sm text-purple-800">Years Covered</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-3xl font-bold text-amber-600">
                {actualStats.yearRange.start}-{actualStats.yearRange.end}
              </div>
              <div className="text-sm text-amber-800">Year Range</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Countries Included</h4>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                {actualStats.uniqueCountries.join(', ')}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Years Available</h4>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {actualStats.uniqueYears.join(', ')}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Correlation Analysis */}
        {correlations && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-lg mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
              Actual Correlation Analysis
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {correlations.male.correlation ? correlations.male.correlation.toFixed(3) : 'N/A'}
                </div>
                <div className="text-lg font-semibold text-blue-800 mb-2">Male Correlation</div>
                <div className="text-sm text-blue-700">
                  {correlations.male.dataPoints} data points
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  Alcohol: {correlations.male.alcoholRange.min.toFixed(1)} - {correlations.male.alcoholRange.max.toFixed(1)}<br/>
                  Suicide: {correlations.male.suicideRange.min.toFixed(1)} - {correlations.male.suicideRange.max.toFixed(1)}
                </div>
              </div>
              
              <div className="text-center p-6 bg-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-pink-600">
                  {correlations.female.correlation ? correlations.female.correlation.toFixed(3) : 'N/A'}
                </div>
                <div className="text-lg font-semibold text-pink-800 mb-2">Female Correlation</div>
                <div className="text-sm text-pink-700">
                  {correlations.female.dataPoints} data points
                </div>
                <div className="text-xs text-pink-600 mt-2">
                  Alcohol: {correlations.female.alcoholRange.min.toFixed(1)} - {correlations.female.alcoholRange.max.toFixed(1)}<br/>
                  Suicide: {correlations.female.suicideRange.min.toFixed(1)} - {correlations.female.suicideRange.max.toFixed(1)}
                </div>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {correlations.combined.correlation ? correlations.combined.correlation.toFixed(3) : 'N/A'}
                </div>
                <div className="text-lg font-semibold text-green-800 mb-2">Combined</div>
                <div className="text-sm text-green-700">
                  {correlations.combined.dataPoints} data points
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Extreme Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-red-600" />
            Extreme Values (Male Data)
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Highest Rates</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <div className="font-semibold text-red-800">Highest Alcohol Mortality</div>
                  <div className="text-red-700">
                    {extremeValues.highestMaleAlcohol.country} ({extremeValues.highestMaleAlcohol.year}): 
                    {extremeValues.highestMaleAlcohol.alcohol_rate.toFixed(2)} per 100k
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <div className="font-semibold text-red-800">Highest Suicide Rate</div>
                  <div className="text-red-700">
                    {extremeValues.highestMaleSuicide.country} ({extremeValues.highestMaleSuicide.year}): 
                    {extremeValues.highestMaleSuicide.suicide_rate.toFixed(2)} per 100k
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Lowest Rates</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="font-semibold text-green-800">Lowest Alcohol Mortality</div>
                  <div className="text-green-700">
                    {extremeValues.lowestMaleAlcohol.country} ({extremeValues.lowestMaleAlcohol.year}): 
                    {extremeValues.lowestMaleAlcohol.alcohol_rate.toFixed(2)} per 100k
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="font-semibold text-green-800">Lowest Suicide Rate</div>
                  <div className="text-green-700">
                    {extremeValues.lowestMaleSuicide.country} ({extremeValues.lowestMaleSuicide.year}): 
                    {extremeValues.lowestMaleSuicide.suicide_rate.toFixed(2)} per 100k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gender Ratios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Gender Ratios (Male:Female)</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Alcohol Mortality</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {genderRatios
                  .sort((a, b) => (b?.alcoholRatio || 0) - (a?.alcoholRatio || 0))
                  .slice(0, 5)
                  .map((ratio, index) => (
                    <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                      <strong>{ratio?.country}:</strong> {ratio?.alcoholRatio.toFixed(1)}:1
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Suicide Rates</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {genderRatios
                  .sort((a, b) => (b?.suicideRatio || 0) - (a?.suicideRatio || 0))
                  .slice(0, 5)
                  .map((ratio, index) => (
                    <div key={index} className="text-sm p-2 bg-purple-50 rounded">
                      <strong>{ratio?.country}:</strong> {ratio?.suicideRatio.toFixed(1)}:1
                    </div>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Accident Rates</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {genderRatios
                  .sort((a, b) => (b?.accidentRatio || 0) - (a?.accidentRatio || 0))
                  .slice(0, 5)
                  .map((ratio, index) => (
                    <div key={index} className="text-sm p-2 bg-amber-50 rounded">
                      <strong>{ratio?.country}:</strong> {ratio?.accidentRatio.toFixed(1)}:1
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fact-Check Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6">Fact-Check Summary</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Verified Claims
              </h4>
              <ul className="space-y-2 text-sm">
                {factCheckResults.verified.map((claim, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    {claim}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Required Corrections
              </h4>
              <div className="space-y-3 text-sm">
                {factCheckResults.corrections.map((correction, index) => (
                  <div key={index}>
                    <div className="text-red-300">❌ {correction.claim}</div>
                    <div className="text-green-300">✓ {correction.reality}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActualFactCheck;