// src/components/Footer.tsx

import { motion } from 'framer-motion';
import { BarChart3, Database, ExternalLink } from 'lucide-react';
import type React from 'react';
import { ACTUAL_DATASET_INFO } from '../data';
import { evidenceSources } from '../data/evidence-sources';

const Footer: React.FC = () => {
  // Use verified dataset information
  const countryCount = ACTUAL_DATASET_INFO.uniqueCountries;

  // Count actual evidence sources
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
      title: 'Academic Evidence Sources',
      url: '#evidence-modal',
      description: `${evidenceCount} peer-reviewed studies (${academicSources} academic, ${institutionalSources} institutional, ${governmentSources} government)`,
      onClick: () => {
        // Create and show a modal with evidence sources
        showEvidenceModal();
      },
    },
  ];

  const showEvidenceModal = () => {
    // Create a simple modal to show evidence sources
    const modal = document.createElement('div');
    modal.className =
      'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs';
    modal.innerHTML = `
      <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 class="text-xl font-bold text-gray-900">Evidence Sources</h3>
            <p class="text-sm text-gray-600 mt-1">${evidenceCount} peer-reviewed sources backing all research claims</p>
          </div>
          <button onclick="this.closest('.fixed').remove()" class="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div class="grid md:grid-cols-2 gap-6">
            ${evidenceSources
              .map(
                (source) => `
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="font-semibold text-gray-900 text-sm">${source.title}</div>
                    <div class="text-xs text-gray-600 mt-1">
                      ${source.authors ? source.authors.join(', ') : source.institution} (${source.year})
                    </div>
                  </div>
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    ${source.type}
                  </span>
                </div>
                <p class="text-xs text-gray-700 mb-3 leading-relaxed">${source.summary}</p>
                <a href="${source.url}" target="_blank" rel="noopener noreferrer" 
                   class="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  View Source
                </a>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

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
              Evidence-based analysis of European mental health and substance abuse patterns through
              a gendered lens. Built to save lives.
            </p>

            {/* Built with Bolt Badge - Using local SVG */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <a
                href="https://bolt.new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group"
              >
                <img
                  src="/white_circle_360x360.svg"
                  alt="Built with Bolt"
                  className="h-8 w-auto hover:scale-110 transition-transform duration-300"
                />
              </a>
            </motion.div>

            {/* Project Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-lg font-bold text-purple-400">{countryCount}</div>
                <div className="text-xs text-gray-400">Countries</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-400">
                  {ACTUAL_DATASET_INFO.yearRange.start}-{ACTUAL_DATASET_INFO.yearRange.end}
                </div>
                <div className="text-xs text-gray-400">Analysis</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-lg font-bold text-green-400">CC BY 4.0</div>
                <div className="text-xs text-gray-400">License</div>
              </div>
            </div>
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
                      <ExternalLink className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
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
          className="border-t border-gray-800 mt-8 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              Data analysis for public health advocacy • Built with Bolt
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              This research is conducted in accordance with ethical guidelines for public health
              data analysis. All data sources are publicly available and properly attributed.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
