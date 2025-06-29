import { motion } from 'framer-motion';
import { BarChart3, Database, TrendingUp } from 'lucide-react';
import type React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  type?: 'chart' | 'data' | 'general';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading data...',
  type = 'general',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'chart':
        return <BarChart3 className="w-8 h-8" />;
      case 'data':
        return <Database className="w-8 h-8" />;
      default:
        return <TrendingUp className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
          scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
        }}
        className="text-blue-600 mb-4"
      >
        {getIcon()}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
        <p className="text-sm text-gray-600 max-w-md">
          If charts remain empty, please check your connection or refresh the page
        </p>
      </motion.div>

      {/* Animated dots */}
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-blue-600 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
