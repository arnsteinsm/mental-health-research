import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Database, BarChart3 } from 'lucide-react';
import { researchData } from '../data/research-data';

const Footer: React.FC = () => {
  // Calculate actual country count from data
  const countryCount = Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020').length;

  const dataSources = [
    {
      title: "Eurostat Health Database",
      url: "https://ec.europa.eu/eurostat/web/health/data/database",
      description: "Official EU health statistics"
    },
    {
      title: "WHO Mortality Database", 
      url: "https://www.who.int/data/data-collection-tools/who-mortality-database",
      description: "Global mortality data standards"
    },
    {
      title: "OECD Health Statistics",
      url: "https://www.oecd.org/health/health-data.htm", 
      description: "Comparative health indicators"
    }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Branding & Mission - Now takes up equal space */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-bold">Behind the Drink</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Evidence-based analysis of European mental health and substance abuse patterns 
              through a gendered lens. Built to save lives.
            </p>
            
            {/* Built with Bolt Badge */}
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
                  className="h-10 w-10 hover:scale-110 transition-transform duration-300"
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
                <div className="text-lg font-bold text-blue-400">2011-2022</div>
                <div className="text-xs text-gray-400">Analysis</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-lg font-bold text-green-400">CC BY 4.0</div>
                <div className="text-xs text-gray-400">License</div>
              </div>
            </div>
          </div>

          {/* Data Sources - Now more compact */}
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-3 hover:text-blue-400 transition-colors group"
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