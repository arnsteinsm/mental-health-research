import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Database, BarChart3 } from 'lucide-react';
import { ACTUAL_DATASET_INFO } from '../data/correlation-verification';

const Footer: React.FC = () => {
  // Use verified dataset information
  const countryCount = ACTUAL_DATASET_INFO.uniqueCountries.length;

  const dataSources = [
    {
      title: "Eurostat Mortality Data",
      url: "https://data.europa.eu/data/datasets/rep2namroxi8l8deyq15w?locale=en",
      description: "Death due to alcoholic abuse, by sex"
    },
    {
      title: "Eurostat Suicide Statistics", 
      url: "https://data.europa.eu/data/datasets/dvvny3x2o5wag4yfbrkmhq?locale=en",
      description: "Death due to suicide, by sex"
    },
    {
      title: "Academic Evidence Sources",
      url: "#bibliography",
      description: "50+ peer-reviewed studies and reports"
    }
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
              Evidence-based analysis of European mental health and substance abuse patterns 
              through a gendered lens. Built to save lives.
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
                <div className="text-lg font-bold text-blue-400">{ACTUAL_DATASET_INFO.yearRange.start}-{ACTUAL_DATASET_INFO.yearRange.end}</div>
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
              {dataSources.map((source, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <a 
                    href={source.url}
                    target={source.url.startsWith('#') ? '_self' : '_blank'}
                    rel={source.url.startsWith('#') ? '' : 'noopener noreferrer'}
                    className="flex items-start space-x-3 hover:text-blue-400 transition-colors group"
                    onClick={source.url.startsWith('#') ? (e) => {
                      e.preventDefault();
                      const element = document.querySelector(source.url);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    } : undefined}
                  >
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-medium text-sm">{source.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{source.description}</div>
                    </div>
                  </a>
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
              This research is conducted in accordance with ethical guidelines for public health data analysis. 
              All data sources are publicly available and properly attributed.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;