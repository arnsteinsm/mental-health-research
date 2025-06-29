import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, ArrowRight, Share2, ExternalLink } from 'lucide-react';
import { CORRELATION_DISPLAY, VERIFIED_GENDER_RATIO } from '../data/correlation-verification';
import EvidenceButton from './EvidenceButton';

const Conclusions: React.FC = () => {
  const solutions = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Reach At-Risk Men Sooner",
      description: "Develop interventions that address masculine stigma and provide alternative pathways to support before crisis points.",
      evidence: "Research shows men are 3x less likely to seek help",
      priority: "Critical",
      evidenceId: "male-focused-programs",
      actionable: "Create male-friendly mental health spaces in workplaces, sports clubs, and community centers"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Support Mental Health at Work",
      description: "Target male-dominated industries with comprehensive mental health support systems and peer networks.",
      evidence: "Male-dominated occupations show higher suicide rates",
      priority: "High",
      evidenceId: "workplace-mental-health",
      actionable: "Implement mental health first aid training and peer support programs in construction, farming, and manufacturing"
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: "Combine Health, Policy, and Community Support",
      description: "Address alcohol and mental health together through integrated treatment and community-based interventions.",
      evidence: "74% of male suicides involve alcohol vs 31% for females",
      priority: "Essential",
      evidenceId: "integrated-treatment",
      actionable: "Establish dual-diagnosis treatment centers and train healthcare providers in integrated approaches"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What the Data Demands
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            The correlation is clear (r = {CORRELATION_DISPLAY.male}). The crisis is real. 
            These evidence-based approaches offer a path forward—and they're already working in some places.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-purple-600 rounded-lg">
                  {solution.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">{solution.title}</h4>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      solution.priority === 'Critical' 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                        : solution.priority === 'High'
                        ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                    }`}>
                      {solution.priority}
                    </span>
                  </div>
                  <p className="text-purple-200 leading-relaxed mb-3">{solution.description}</p>
                  
                  {/* Actionable Implementation */}
                  <div className="text-xs text-green-300 bg-green-500/20 p-3 rounded border border-green-500/30 mb-3">
                    <strong>How to implement:</strong> {solution.actionable}
                  </div>
                  
                  <div className="text-xs text-blue-300 bg-blue-500/20 p-2 rounded border border-blue-500/30">
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

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">These Approaches Are Already Working</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-green-300 mb-3">🇦🇺 Australia's Male Health Policy</h4>
              <p className="text-purple-200 text-sm leading-relaxed">
                National male-focused mental health programs have reduced alcohol mortality by 25% 
                in targeted regions through workplace interventions and community outreach.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-green-300 mb-3">🇮🇪 Ireland's Connecting for Life</h4>
              <p className="text-purple-200 text-sm leading-relaxed">
                Integrated suicide prevention strategy addressing alcohol and mental health together 
                has shown measurable reductions in male suicide rates across multiple counties.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Every Share Could Save a Life</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            This research provides a roadmap for addressing one of Europe's most pressing but hidden health crises. 
            The solutions exist. The evidence is clear. Now we need action.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 className="w-5 h-5 mr-2" />
              Share with Policymakers
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors">
              <Users className="w-5 h-5 mr-2" />
              Contact Healthcare Leaders
            </button>
            <button className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors">
              Start Conversations
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Conclusions;