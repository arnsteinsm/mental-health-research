import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Check, ExternalLink } from 'lucide-react';

interface DownloadCTAProps {
  variant?: 'header' | 'footer';
  className?: string;
}

const DownloadCTA: React.FC<DownloadCTAProps> = ({ variant = 'header', className = '' }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadComplete(true);
      
      // Reset after 3 seconds
      setTimeout(() => setDownloadComplete(false), 3000);
      
      // In a real implementation, this would trigger the actual download
      console.log('Downloading full analysis report...');
    }, 2000);
  };

  if (variant === 'header') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className={`${className}`}
      >
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloadComplete ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Downloaded!
            </>
          ) : isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Download />
              </motion.div>
              Preparing...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Beyond the Numbers
            </>
          )}
        </button>
        <div className="text-xs text-gray-600 mt-1 text-center">
          Full analysis with detailed insights
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`text-center ${className}`}
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Beyond the Numbers: Complete Analysis
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Download the comprehensive report with detailed methodology, additional visualizations, 
          policy recommendations, and statistical appendices. Perfect for researchers, policymakers, 
          and advocates working on mental health initiatives.
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-semibold text-blue-900">40+ Pages</div>
            <div className="text-blue-700">Comprehensive analysis</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-semibold text-purple-900">15+ Charts</div>
            <div className="text-purple-700">Additional visualizations</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-semibold text-green-900">Open Access</div>
            <div className="text-green-700">CC BY 4.0 License</div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloadComplete ? (
            <>
              <Check className="w-5 h-5 mr-3" />
              Report Downloaded Successfully!
            </>
          ) : isDownloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 mr-3"
              >
                <Download />
              </motion.div>
              Preparing Download...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-3" />
              Download Full Analysis (PDF, 2.3MB)
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-3">
          By downloading, you agree to cite this research appropriately in any derivative works
        </p>
      </div>
    </motion.div>
  );
};

export default DownloadCTA;