import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Filter, Search } from 'lucide-react';
import { evidenceSources, formatCitation, EvidenceSource } from '../data/evidence-sources';

const Bibliography: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | EvidenceSource['type']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSources = evidenceSources.filter(source => {
    const matchesType = filterType === 'all' || source.type === filterType;
    const matchesSearch = source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (source.authors && source.authors.some(author => 
                           author.toLowerCase().includes(searchTerm.toLowerCase()))) ||
                         (source.institution && source.institution.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getTypeColor = (type: EvidenceSource['type']) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'institutional': return 'bg-green-100 text-green-800 border-green-200';
      case 'government': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'meta-analysis': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const sourcesByType = {
    academic: evidenceSources.filter(s => s.type === 'academic').length,
    institutional: evidenceSources.filter(s => s.type === 'institutional').length,
    government: evidenceSources.filter(s => s.type === 'government').length,
    'meta-analysis': evidenceSources.filter(s => s.type === 'meta-analysis').length
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Complete Bibliography
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            All evidence claims in this research are backed by peer-reviewed academic sources, 
            institutional reports, and government publications.
          </p>
        </motion.div>

        {/* Source Type Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{sourcesByType.academic}</div>
            <div className="text-sm text-blue-800">Academic Papers</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{sourcesByType.institutional}</div>
            <div className="text-sm text-green-800">Institutional Reports</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{sourcesByType.government}</div>
            <div className="text-sm text-purple-800">Government Publications</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{sourcesByType['meta-analysis']}</div>
            <div className="text-sm text-red-800">Meta-Analyses</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Source Types</option>
                <option value="academic">Academic Papers</option>
                <option value="institutional">Institutional Reports</option>
                <option value="government">Government Publications</option>
                <option value="meta-analysis">Meta-Analyses</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredSources.length} of {evidenceSources.length} sources
          </div>
        </motion.div>

        {/* Sources List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {filteredSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(source.type)}`}>
                    {source.type.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-500">({source.year})</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{source.title}</h3>
              
              <div className="text-sm text-gray-600 mb-3">
                {source.authors ? (
                  <span><strong>Authors:</strong> {source.authors.join(', ')}</span>
                ) : source.institution ? (
                  <span><strong>Institution:</strong> {source.institution}</span>
                ) : null}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{source.summary}</p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono flex-1 mr-4">
                  {formatCitation(source)}
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Source
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Citation Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-blue-900 mb-4">Citation Guidelines</h3>
          <div className="text-sm text-blue-800 space-y-3">
            <p>
              <strong>For Academic Use:</strong> All sources follow standard academic citation formats. 
              Copy the formatted citations provided above for your reference list.
            </p>
            <p>
              <strong>For Media Use:</strong> When reporting on this research, please cite the original sources 
              rather than this analysis to maintain journalistic integrity.
            </p>
            <p>
              <strong>For Policy Use:</strong> Government and institutional sources are particularly relevant 
              for policy development and implementation guidance.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Bibliography;