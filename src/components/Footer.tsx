import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Database, Calendar, Scale, BarChart3, Heart } from 'lucide-react';
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

  const currentYear = new Date().getFullYear();
  const lastUpdated = "June 2025";

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <span className="text-lg font-bold">Behind the Drink</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Evidence-based analysis of European mental health and substance abuse patterns 
              through a gendered lens. Built to save lives.
            </p>
            
            {/* Hackathon Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-300 font-semibold text-sm">Bolt Hackathon 2025</span>
              </div>
              <p className="text-yellow-200 text-xs leading-relaxed">
                Built in 24 hours to raise awareness about Europe's hidden mental health crisis
              </p>
            </motion.div>
            
            {/* Official Built with Bolt Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
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
                  className="h-12 w-12 hover:scale-110 transition-transform duration-300"
                />
              </a>
            </motion.div>
          </div>

          {/* Data Sources */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-400" />
              Data Sources
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {dataSources.map((source, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <a 
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start space-x-2 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{source.title}</div>
                      <div className="text-xs text-gray-400">{source.description}</div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Impact & Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-400" />
              Impact
            </h4>
            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                <div className="font-medium text-white">Crisis Revealed</div>
                <div>3.7x higher male alcohol mortality</div>
              </div>
              
              <div className="text-sm text-gray-400">
                <div className="font-medium text-white">Evidence Provided</div>
                <div>50+ peer-reviewed sources</div>
              </div>
              
              <div className="text-sm text-gray-400">
                <div className="font-medium text-white">Lives at Stake</div>
                <div>~50,000 annual deaths in Europe</div>
              </div>
              
              <a 
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Scale className="w-4 h-4 mr-2" />
                CC BY 4.0 License
              </a>
              
              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                Updated {lastUpdated}
              </div>
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
              © {currentYear} Behind the Drink Research Project. Data analysis for public health advocacy.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>{countryCount} European Countries</span>
              <span>•</span>
              <span>2011-2018 Analysis</span>
              <span>•</span>
              <span>Open Data Initiative</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 max-w-4xl mx-auto">
              <h5 className="font-semibold text-red-300 mb-2">🚨 Crisis Helplines</h5>
              <p className="text-sm text-red-200 leading-relaxed">
                If you or someone you know is struggling: <strong>Europe 116 123</strong> • 
                <strong> Crisis Text: HOME to 741741</strong> • 
                <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  International Resources
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              This research is conducted in accordance with ethical guidelines for public health data analysis. 
              All data sources are publicly available and properly attributed. 
              <strong className="text-gray-400"> Every share could save a life.</strong>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;