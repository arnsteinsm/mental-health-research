import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Twitter, Linkedin, Facebook, Mail, ExternalLink } from 'lucide-react';

interface ShareButtonProps {
  variant?: 'floating' | 'inline';
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ variant = 'floating', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = "Behind the Drink: Men are dying from alcohol at 3.7x the rate of women";
  const description = "This isn't just about drinking—it's about mental health. New analysis reveals the hidden crisis behind European alcohol mortality data.";

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />,
      action: async () => {
        try {
          await navigator.clipboard.writeText(currentUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      },
      color: copied ? 'text-green-600' : 'text-gray-600'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-4 h-4" />,
      action: () => {
        const tweetText = `${title}\n\n${description}\n\n${currentUrl}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
      },
      color: 'text-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4" />,
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
      },
      color: 'text-blue-700'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
      },
      color: 'text-blue-600'
    },
    {
      name: 'Email',
      icon: <Mail className="w-4 h-4" />,
      action: () => {
        const subject = encodeURIComponent(title);
        const body = encodeURIComponent(`${description}\n\nRead the full analysis: ${currentUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
      color: 'text-gray-600'
    }
  ];

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, duration: 0.5, type: "spring" }}
        >
          {/* Share Options */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[200px]"
            >
              <div className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share This Research
              </div>
              <div className="space-y-2">
                {shareOptions.map((option, index) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${option.color}`}
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Help spread awareness about this critical mental health crisis
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Share Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Share This Research
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-[250px] z-50"
        >
          <div className="text-sm font-semibold text-gray-900 mb-3">Share this analysis</div>
          <div className="grid grid-cols-2 gap-2">
            {shareOptions.map((option, index) => (
              <button
                key={option.name}
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors ${option.color}`}
              >
                {option.icon}
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 leading-relaxed">
              Every share helps raise awareness about this critical issue
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShareButton;