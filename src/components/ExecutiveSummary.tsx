import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { researchData } from '../data/research-data';

const ExecutiveSummary: React.FC = () => {
  // Calculate actual country count from data
  const countryCount = Array.from(new Set(researchData.map(d => d.country)))
    .filter(country => country !== 'EU27_2020').length;

  const keyStats = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "3.7x Higher",
      subtitle: "Male alcohol mortality",
      description: "Men consistently show dramatically higher alcohol-related death rates across all European countries.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "r = 0.76",
      subtitle: "Alcohol-Suicide Link (Men)",
      description: "Strong correlation reveals alcohol misuse as both symptom and risk factor for mental health crises.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hidden Crisis",
      subtitle: "Mental Health Emergency",
      description: "Data reveals alcohol deaths are masking a broader male mental health crisis across Europe.",
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <section id="executive-summary" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Hidden Crisis
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Analysis of {countryCount} European countries reveals that male alcohol mortality isn't just about drinking—
            it's a symptom of a deeper mental health emergency that demands immediate attention.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {keyStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white mb-6`}>
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {stat.title}
              </h3>
              <h4 className="text-lg font-semibold text-blue-600 mb-4">
                {stat.subtitle}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Core Research Question - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Why This Matters</h3>
          <p className="text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
            Every alcohol-related death represents a failure to address underlying mental health needs. 
            The strong correlation with suicide rates (r=0.76) shows we're treating symptoms, not causes.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;