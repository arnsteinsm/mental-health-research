import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target, TrendingUp, Globe, Clock } from 'lucide-react';

const ImpactStatement: React.FC = () => {
  const impactMetrics = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Lives at Stake",
      value: "~50,000",
      subtitle: "Annual male alcohol deaths in Europe",
      description: "Each data point represents a life that could be saved with proper mental health intervention"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Hidden Crisis",
      value: "3.7x",
      subtitle: "Higher male mortality rate",
      description: "The gender disparity reveals systematic failures in addressing male mental health"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Correlation Strength",
      value: "r = 0.76",
      subtitle: "Alcohol-suicide link in men",
      description: "Strong statistical evidence that alcohol deaths mask deeper mental health struggles"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "European Scope",
      value: "15 Countries",
      subtitle: "Consistent patterns across cultures",
      description: "The crisis transcends national boundaries, demanding coordinated response"
    }
  ];

  const callsToAction = [
    {
      title: "For Policymakers",
      description: "Implement male-focused mental health programs and integrate alcohol treatment with mental health services",
      urgency: "Critical"
    },
    {
      title: "For Healthcare Providers",
      description: "Screen for mental health issues in alcohol treatment and address masculine stigma in therapy",
      urgency: "High"
    },
    {
      title: "For Advocates",
      description: "Share this research to raise awareness and push for evidence-based policy changes",
      urgency: "Immediate"
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
            The Human Cost of Inaction
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Behind every statistic is a human story. This research isn't just about data—
            it's about fathers, sons, brothers, and friends who could still be with us today.
          </p>
        </motion.div>

        {/* Impact Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
            >
              <div className="text-yellow-400 mb-4 flex justify-center">
                {metric.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{metric.value}</div>
              <div className="text-lg font-semibold text-purple-200 mb-3">{metric.subtitle}</div>
              <div className="text-sm text-purple-100 leading-relaxed">{metric.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Urgency Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-red-400 mr-3" />
            <h3 className="text-2xl font-bold">Every Day Counts</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">137</div>
              <div className="text-sm text-red-300">Men die from alcohol daily in Europe</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">74%</div>
              <div className="text-sm text-orange-300">Of male suicides involve alcohol</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">3x</div>
              <div className="text-sm text-yellow-300">Less likely to seek help</div>
            </div>
          </div>
        </motion.div>

        {/* Calls to Action */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {callsToAction.map((cta, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">{cta.title}</h4>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  cta.urgency === 'Critical' 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                    : cta.urgency === 'High'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}>
                  {cta.urgency}
                </span>
              </div>
              <p className="text-purple-200 leading-relaxed">{cta.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Final Impact Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">This Research Could Save Lives</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
            We've uncovered a hidden crisis where alcohol deaths mask a deeper mental health emergency. 
            The correlation is clear (r = 0.76), the gender disparity is stark (3.7x), and the need for action is urgent. 
            Every share, every policy change, every conversation sparked by this research brings us closer to saving lives.
          </p>
          
          <div className="bg-white/20 rounded-xl p-6 max-w-2xl mx-auto">
            <div className="text-sm font-semibold mb-3">Built with Bolt for the 2025 Hackathon</div>
            <div className="text-xs text-purple-200 leading-relaxed">
              This project demonstrates how modern web technologies can be used to create impactful, 
              data-driven narratives that drive social change. Built in 24 hours to save lives.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactStatement;