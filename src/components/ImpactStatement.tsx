import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target, AlertTriangle } from 'lucide-react';
import { CORRECTED_DISPLAY } from '../data/actual-dataset-verification';

const ImpactStatement: React.FC = () => {
  const coreMetrics = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "~60,000 Deaths",
      subtitle: "Annual male alcohol mortality in Europe",
      description: "Each number represents a preventable loss"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Preventable Crisis",
      subtitle: "Mental health masquerading as addiction",
      description: "Alcohol deaths are symptoms, not the disease"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: `${CORRECTED_DISPLAY.countries} Countries`,
      subtitle: "Consistent patterns across Europe",
      description: "The crisis transcends borders and cultures"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Human Cost
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Behind every statistic is a human story. This research reveals a hidden crisis 
            where alcohol deaths mask deeper mental health struggles.
          </p>
        </motion.div>

        {/* Core Impact Metrics - Clean and Focused */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {coreMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center"
            >
              <div className="text-yellow-400 mb-4 flex justify-center">
                {metric.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{metric.title}</div>
              <div className="text-lg font-semibold text-purple-200 mb-3">{metric.subtitle}</div>
              <div className="text-sm text-purple-100 leading-relaxed">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Single Powerful Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mr-3" />
            <h3 className="text-2xl md:text-3xl font-bold">This Research Could Save Lives</h3>
          </div>
          
          <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            We've uncovered a hidden crisis where alcohol deaths mask a deeper mental health emergency. 
            The pattern is undeniable across {CORRECTED_DISPLAY.countries} European countries. 
            Every share, every policy change, every conversation sparked by this research brings us closer to saving lives.
          </p>
          
          <div className="bg-white/20 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="text-sm font-semibold mb-3">Built for Bolt Hackathon 2025</div>
            <div className="text-xs text-purple-200 leading-relaxed">
              Demonstrating how modern web technologies can create impactful, 
              data-driven narratives that drive social change. Built in 24 hours to save lives.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStatement;