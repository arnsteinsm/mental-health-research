// src/components/Conclusions.tsx

import { motion } from 'framer-motion';
import { ArrowRight, Target, Users } from 'lucide-react';
import type React from 'react';
import { datasetStats } from '../data';
import EvidenceButton from './EvidenceButton';

const Conclusions: React.FC = () => {
  const solutions = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Reach At-Risk Men Sooner',
      description:
        'Develop interventions that address masculine stigma and provide alternative pathways to support.',
      evidence: 'Research shows men are 3x less likely to seek help',
      priority: 'Critical',
      evidenceId: 'male-focused-programs',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Support Mental Health at Work',
      description:
        'Target male-dominated industries with comprehensive mental health support systems.',
      evidence: 'Male-dominated occupations show higher suicide rates',
      priority: 'High',
      evidenceId: 'workplace-mental-health',
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: 'Combine Health, Policy, and Community Support',
      description: 'Address alcohol and mental health together, not as separate issues.',
      evidence: '74% of male suicides involve alcohol vs 31% for females',
      priority: 'Essential',
      evidenceId: 'integrated-treatment',
    },
  ];

  return (
    <section className="py-20 bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What the Data Demands</h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            The correlation is clear (r = {datasetStats.correlations.male.alcoholSuicide.toFixed(2)}
            ). The crisis is real. These            evidence-based approaches offer a path forward.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.evidenceId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xs rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="shrink-0 p-3 bg-purple-600 rounded-lg">{solution.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">{solution.title}</h4>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        solution.priority === 'Critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : solution.priority === 'High'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}
                    >
                      {solution.priority}
                    </span>
                  </div>
                  <p className="text-purple-200 leading-relaxed mb-3">{solution.description}</p>
                  <div className="text-xs text-blue-300 bg-blue-500/20 p-2 rounded-sm border border-blue-500/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <strong>Evidence:</strong> {solution.evidence}
                      </div>
                      <EvidenceButton
                        claimId={solution.evidenceId}
                        claimTitle={solution.title}
                        variant="inline"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Conclusions;
