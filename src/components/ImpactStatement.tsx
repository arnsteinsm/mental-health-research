import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target, ArrowRight } from 'lucide-react';
import { CORRECTED_DISPLAY } from '../data/actual-dataset-verification';

const ImpactStatement: React.FC = () => {
  const coreMetrics = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Lives at Stake",
      subtitle: "Every statistic represents a preventable loss",
      description: "Behind each data point is a father, son, brother, or friend whose struggle went unrecognized",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hidden in Plain Sight",
      subtitle: "Mental health crisis masquerading as addiction",
      description: "Alcohol deaths are symptoms of deeper struggles—depression, anxiety, and social isolation",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Solutions Exist",
      subtitle: "Evidence-based interventions are already working",
      description: "Countries implementing male-focused mental health programs see measurable improvements",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Human Story Behind the Data
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            This research reveals more than statistics—it uncovers a hidden crisis where men's mental health 
            struggles are masked by alcohol-related deaths. But understanding the problem is the first step toward solutions.
          </p>
        </motion.div>

        {/* Core Impact Metrics - Reframed with Hope */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {coreMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center group hover:bg-white/15 transition-all duration-300"
            >
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${metric.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {metric.icon}
              </div>
              <div className="text-2xl font-bold mb-2">{metric.title}</div>
              <div className="text-lg font-semibold text-purple-200 mb-4">{metric.subtitle}</div>
              <div className="text-sm text-purple-100 leading-relaxed">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Urgency with Hope */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center"
        >
          <h3 className="text-2xl font-bold mb-4 text-yellow-300">The Time for Action is Now</h3>
          <p className="text-lg text-purple-100 leading-relaxed mb-6 max-w-3xl mx-auto">
            Across {CORRECTED_DISPLAY.countries} European countries, the pattern is consistent: where we see high alcohol mortality, 
            we see high suicide rates—especially among men. This isn't coincidence. It's a call to action.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <span className="font-semibold">But there's hope</span>
            <ArrowRight className="w-5 h-5" />
            <span className="font-semibold">Solutions are working</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStatement;