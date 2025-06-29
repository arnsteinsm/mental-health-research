import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Share2 } from 'lucide-react';
import type React from 'react';

interface CallToActionProps {
  variant?: 'header' | 'footer';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ variant = 'header', className = '' }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Behind the Drink: European Mental Health Crisis',
        text: 'Men are dying from alcohol at 3.7x the rate of women. This analysis reveals the hidden mental health crisis.',
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
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
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Research
        </button>
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
        <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Voice Can Change the Data</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Help raise awareness about this critical mental health crisis. Share this research with
          policymakers, healthcare professionals, and advocates working on mental health
          initiatives.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-semibold text-blue-900">Evidence-Based</div>
            <div className="text-blue-700">Peer-reviewed sources</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-semibold text-purple-900">Open Access</div>
            <div className="text-purple-700">Free to share & cite</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-semibold text-green-900">Action-Oriented</div>
            <div className="text-green-700">Policy recommendations</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleShare}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Share2 className="w-5 h-5 mr-3" />
            Share This Research
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Every share helps raise awareness about this critical public health issue
        </p>
      </div>
    </motion.div>
  );
};

export default CallToAction;
