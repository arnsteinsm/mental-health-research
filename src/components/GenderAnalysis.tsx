import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, Heart, ArrowRight } from 'lucide-react';
import { CORRELATION_DISPLAY, VERIFIED_GENDER_RATIO } from '../data/correlation-verification';
import EvidenceButton from './EvidenceButton';

const GenderAnalysis: React.FC = () => {
  const insights = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Societal Expectations",
      description: "Traditional masculine norms discourage help-seeking behavior, leading men to self-medicate with alcohol rather than seek professional mental health support.",
      color: "from-blue-500 to-blue-600",
      evidenceId: "societal-expectations",
      connections: ["Mental Health Stigma", "Social Isolation"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Economic Pressures",
      description: "Men face disproportionate pressure as primary breadwinners, with economic stress correlating strongly with both alcohol misuse and suicide rates.",
      color: "from-purple-500 to-purple-600",
      evidenceId: "economic-pressures",
      connections: ["Societal Expectations", "Mental Health Stigma"]
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Mental Health Stigma",
      description: "The stigma around male mental health creates a dangerous cycle where alcohol becomes the primary coping mechanism for emotional distress.",
      color: "from-red-500 to-red-600",
      evidenceId: "mental-health-stigma",
      connections: ["Societal Expectations", "Social Isolation"]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Social Isolation",
      description: "Men report fewer close friendships and support networks, making them more vulnerable to mental health crises and substance abuse.",
      color: "from-green-500 to-green-600",
      evidenceId: "social-isolation",
      connections: ["Mental Health Stigma", "Economic Pressures"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Understanding Male Vulnerability
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            The data reveals a complex web of interconnected factors that create a perfect storm 
            of mental health vulnerability for men across Europe. These aren't isolated issues—they 
            reinforce each other in a dangerous cycle.
          </p>
          
          {/* Interconnected Emphasis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center mb-3">

              <span className="font-semibold text-amber-900">Critical Understanding</span>

            </div>
            <p className="text-amber-800 text-sm leading-relaxed">
              These four factors don't operate in isolation—they're deeply interconnected. 
              Economic pressure reinforces societal expectations, which amplifies mental health stigma, 
              leading to social isolation, which cycles back to worsen all other factors. 
              Breaking this cycle requires addressing all elements simultaneously.
            </p>
          </motion.div>
        </motion.div>

        {/* Analysis Grid with Connection Indicators */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 relative">
          {/* Connection Lines - Hidden on mobile */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" style={{ zIndex: 1 }}>
              {/* Diagonal connection lines */}
              <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
              <line x1="75%" y1="25%" x2="25%" y2="75%" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
            </svg>
          </div>

          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
              style={{ zIndex: 2 }}
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${insight.color} text-white mb-6`}>
                {insight.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{insight.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{insight.description}</p>
              
              {/* Connection Indicators */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs font-semibold text-gray-700 mb-2">Interconnected with:</div>
                <div className="flex flex-wrap gap-1">
                  {insight.connections.map((connection, idx) => (
                    <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {connection}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <EvidenceButton 
                  claimId={insight.evidenceId}
                  claimTitle={insight.title}
                  variant="block"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenderAnalysis;