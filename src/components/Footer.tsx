// src/components/Footer.tsx

import { motion } from 'framer-motion';
import { BarChart3, Database, ExternalLink, FileText } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { calculateCorrelations, calculateGenderRatio, datasetStats } from '../data';
import { evidenceSources } from '../data/evidence-sources';
import { useResearchData } from '../services/data-service';
import EvidenceModal from './EvidenceModal';

const Footer: React.FC = () => {
  // Get live data from Supabase
  const { data: researchData = [] } = useResearchData();

  // Use verified dataset information
  const countryCount = datasetStats.countries.length;
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  // Calculate real statistics from live data with fallbacks
  const correlations =
    researchData.length > 0
      ? calculateCorrelations(researchData)
      : {
          overall: datasetStats.correlations.overall.alcoholSuicide,
          male: datasetStats.correlations.male.alcoholSuicide,
          female: datasetStats.correlations.female.alcoholSuicide,
        };
  const genderRatio =
    researchData.length > 0
      ? calculateGenderRatio(researchData)
      : datasetStats.genderRatios.averageRatio;

  const evidenceCount = evidenceSources.length;
  const academicSources = evidenceSources.filter((s) => s.type === 'academic').length;
  const institutionalSources = evidenceSources.filter((s) => s.type === 'institutional').length;
  const governmentSources = evidenceSources.filter((s) => s.type === 'government').length;

  const dataSources = [
    {
      title: 'Eurostat Mortality Data',
      url: 'https://data.europa.eu/data/datasets/rep2namroxi8l8deyq15w?locale=en',
      description: 'Death due to alcoholic abuse, by sex',
    },
    {
      title: 'Eurostat Suicide Statistics',
      url: 'https://data.europa.eu/data/datasets/dvvny3x2o5wag4yfbrkmhq?locale=en',
      description: 'Death due to suicide, by sex',
    },
    {
      title: 'Eurostat Population Data',
      url: 'https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en',
      description: 'Population by age groups and sex',
    },
    {
      title: 'Academic Evidence Sources',
      url: '#evidence-modal',
      description: `${evidenceCount} peer-reviewed studies (${academicSources} academic, ${institutionalSources} institutional, ${governmentSources} government)`,
      onClick: () => {
        setIsEvidenceModalOpen(true);
      },
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Branding & Mission */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-bold">Behind the Drink</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              What the data proves: alcohol misuse reflects deeper mental health struggles,
              especially for men. <em>Behind every statistic is a life.</em>
            </p>

            {/* Key Research Insights */}
            <div className="space-y-4 mb-6">
              <div>
                <h5 className="text-white font-medium text-sm mb-2">Key Findings</h5>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>
                    • Strong correlation (r={correlations.overall.toFixed(2)}) between alcohol and
                    suicide mortality
                  </li>
                  <li>• Men show {genderRatio}x higher alcohol-related death rates than women</li>
                  <li>• Consistent patterns across all {countryCount} European countries</li>
                </ul>
              </div>

              <div>
                <h5 className="text-white font-medium text-sm mb-2">Methodology</h5>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>• Age-standardized mortality rates per 100,000 population</li>
                  <li>• 12-year longitudinal analysis (2011-2022)</li>
                  <li>• Gender-disaggregated data across all countries</li>
                </ul>
              </div>
            </div>

            {/* Built with Bolt Badge - Using local SVG */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group"
              >
                <img
                  src="/logotext_poweredby_360w.png"
                  alt="Logo/attribution:Built with Bolt.new"
                  className="h-8 w-auto hover:scale-110 transition-transform duration-300"
                />
              </a>
            </motion.div>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-400" />
              Data Sources
            </h4>
            <div className="space-y-4">
              {dataSources.map((source, _index) => (
                <div key={source.title} className="bg-gray-800 rounded-lg p-4">
                  {source.onClick ? (
                    <button
                      type="button"
                      onClick={source.onClick}
                      className="flex items-start space-x-3 hover:text-blue-400 transition-colors group w-full text-left"
                    >
                      <FileText className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-sm">{source.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{source.description}</div>
                      </div>
                    </button>
                  ) : (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 hover:text-blue-400 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium text-sm">{source.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{source.description}</div>
                      </div>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-6"
        >
          <div className="text-xs text-gray-500 text-center">
            <p>
              This research is conducted in accordance with ethical guidelines for public health
              data analysis. All data sources are publicly available and properly attributed.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal isOpen={isEvidenceModalOpen} onClose={() => setIsEvidenceModalOpen(false)} />
    </footer>
  );
};

export default Footer;
