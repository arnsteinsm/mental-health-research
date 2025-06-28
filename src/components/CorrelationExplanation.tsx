import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, TrendingUp, AlertCircle, Calculator, X } from 'lucide-react';
import { CORRELATION_DISPLAY, VERIFIED_GENDER_RATIO } from '../data/correlation-verification';

const CorrelationExplanation: React.FC = () => {
  const [showExplainer, setShowExplainer] = useState(false);

  const realWorldExamples = [
    {
      country: "Lithuania",
      alcoholRate: 60.97,
      suicideRate: 121.86,
      story: "Highest rates in both metrics - behind these numbers are families devastated by preventable loss."
    },
    {
      country: "Estonia", 
      alcoholRate: 25.65,
      suicideRate: 82.5,
      story: "Strong correlation shows how alcohol and mental health crises intertwine in post-Soviet societies."
    },
    {
      country: "Germany",
      alcoholRate: 17.88,
      suicideRate: 47.28,
      story: "Even in wealthy nations, the pattern persists - prosperity doesn't eliminate male vulnerability."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Connection is Real
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Where alcohol deaths rise, suicide rates follow—especially among men. 
            This isn't coincidence; it's a pattern that demands action.
          </p>
          
          {/* Quick Explainer Toggle */}
          <button
            onClick={() => setShowExplainer(true)}
            className="inline-flex items-center mt-6 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            What does r = {CORRELATION_DISPLAY.male} mean?
          </button>
        </motion.div>

        {/* Real-World Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Real Numbers, Real Lives</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {realWorldExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                  <h4 className="text-lg font-bold text-gray-900">{example.country}</h4>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alcohol Deaths:</span>
                    <span className="font-semibold text-red-600">{example.alcoholRate}/100k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Suicide Rate:</span>
                    <span className="font-semibold text-red-600">{example.suicideRate}/100k</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  {example.story}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Correlation Strength - Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Gender Divide</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">{CORRELATION_DISPLAY.male}</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Men</div>
              <div className="text-sm text-gray-600">Strong correlation - alcohol and suicide move together</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600 mb-2">{CORRELATION_DISPLAY.female}</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Women</div>
              <div className="text-sm text-gray-600">Moderate correlation - less pronounced pattern</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{VERIFIED_GENDER_RATIO}x</div>
              <div className="text-lg font-semibold text-gray-800 mb-2">Gender Gap</div>
              <div className="text-sm text-gray-600">Higher male alcohol mortality rate</div>
            </div>
          </div>
        </motion.div>

        {/* Explainer Modal */}
        {showExplainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-blue-600" />
                  Understanding r = {CORRELATION_DISPLAY.male}
                </h3>
                <button
                  onClick={() => setShowExplainer(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Correlation coefficient (r)</strong> measures how closely two things move together, 
                  from -1 (perfect opposite) to +1 (perfect together).
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    <strong>r = {CORRELATION_DISPLAY.male} means:</strong> In countries where alcohol deaths are high, 
                    suicide rates are also high {Math.round(parseFloat(CORRELATION_DISPLAY.male) * 100)}% of the time. 
                    This is considered a "strong" correlation.
                  </p>
                </div>
                
                <p className="text-gray-700">
                  <strong>Why this matters:</strong> It suggests alcohol misuse and suicide share common causes—
                  likely untreated mental health struggles that men face difficulty addressing.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CorrelationExplanation;