import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookOpen, Building, ExternalLink, FileText, X } from 'lucide-react';
import type React from 'react';
import { type EvidenceSource, formatCitation } from '../data/evidence-sources';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: EvidenceSource[];
  claimTitle: string;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({ isOpen, onClose, sources, claimTitle }) => {
  const getTypeIcon = (type: EvidenceSource['type']) => {
    switch (type) {
      case 'academic':
        return <BookOpen className="w-5 h-5" />;
      case 'institutional':
        return <Building className="w-5 h-5" />;
      case 'government':
        return <FileText className="w-5 h-5" />;
      case 'meta-analysis':
        return <BarChart3 className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: EvidenceSource['type']) => {
    switch (type) {
      case 'academic':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'institutional':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'government':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'meta-analysis':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Evidence Sources</h3>
                <p className="text-sm text-gray-600 mt-1">{claimTitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {sources.map((source, _index) => (
                  <div key={source.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getTypeColor(source.type)}`}>
                          {getTypeIcon(source.type)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{source.title}</div>
                          <div className="text-sm text-gray-600">
                            {source.authors ? source.authors.join(', ') : source.institution} (
                            {source.year})
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(source.type)}`}
                      >
                        {source.type.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{source.summary}</p>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-sm font-mono">
                        {formatCitation(source)}
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Source
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Citation Format */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How to Cite These Sources</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  {sources.map((source, index) => (
                    <div key={source.id} className="font-mono text-xs bg-white p-2 rounded-sm border">
                      {index + 1}. {formatCitation(source)} Retrieved from {source.url}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EvidenceModal;
