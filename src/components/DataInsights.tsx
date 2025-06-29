import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import { CORRECTED_DISPLAY } from '../data/actual-dataset-verification';

const DataInsights: React.FC = () => {
  // 2. DATA VISUALIZATION WITH PLAIN-LANGUAGE EXPLANATIONS (10-15 words max)
  const insights = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      metric: `${CORRECTED_DISPLAY.genderRatio}x Higher`,
      label: "Male alcohol mortality rate",
      explanation: "Men die from alcohol at nearly four times women's rate",
      significance: "Indicates systematic gender-specific vulnerability requiring targeted intervention",
      color: "from-red-500 to-red-600",
      priority: "Critical"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      metric: "Strong Link",
      label: "Alcohol deaths predict suicide rates",
      explanation: "Where alcohol deaths rise, suicide rates follow predictably",
      significance: "Suggests alcohol misuse often masks underlying mental health crises",
      color: "from-purple-500 to-purple-600",
      priority: "High"
    },
    {
      icon: <Users className="w-8 h-8" />,
      metric: "74% vs 31%",
      label: "Alcohol involvement in suicide",
      explanation: "Three-quarters of male suicides involve alcohol versus one-third female",
      significance: "Reveals alcohol as primary coping mechanism for male mental distress",
      color: "from-blue-500 to-blue-600",
      priority: "High"
    },
    {
      icon: <Target className="w-8 h-8" />,
      metric: "25% Reduction",
      label: "With targeted programs",
      explanation: "Countries with male-focused interventions show measurable mortality decreases",
      significance: "Proves that evidence-based approaches save lives when properly implemented",
      color: "from-green-500 to-green-600",
      priority: "Solution"
    }
  ];

  return (
    <section id="data-insights" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* 3. SOLUTION-FOCUSED SECTION HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What the Data Reveals
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            European health data from {CORRECTED_DISPLAY.countries} countries shows clear patterns—and clear paths forward. 
            Understanding these connections helps us save lives.
          </p>
        </motion.div>

        {/* 2. VISUAL HIERARCHY WITH CLEAR EXPLANATIONS */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Priority indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${insight.color} text-white`}>
                  {insight.icon}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  insight.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                  insight.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                  insight.priority === 'Solution' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {insight.priority}
                </span>
              </div>

              {/* Main metric - large and clear */}
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {insight.metric}
              </h3>
              
              {/* Label - descriptive but concise */}
              <h4 className="text-lg font-semibold text-blue-600 mb-4">
                {insight.label}
              </h4>
              
              {/* Plain-language explanation (10-15 words) */}
              <p className="text-gray-700 font-medium mb-4 text-lg leading-relaxed">
                {insight.explanation}
              </p>
              
              {/* Real-world significance */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-semibold text-gray-800 mb-2">Why This Matters:</div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {insight.significance}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. CONCRETE ACTION ITEMS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            From Data to Action: What We Can Do Now
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* For Policymakers */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">For Policymakers</h4>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Fund male-specific mental health programs</li>
                <li>• Integrate alcohol and mental health services</li>
                <li>• Target workplace mental health initiatives</li>
                <li>• Measure outcomes with gender-specific metrics</li>
              </ul>
            </div>

            {/* For Healthcare Providers */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">For Healthcare Providers</h4>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Screen for mental health in alcohol treatment</li>
                <li>• Address masculine stigma in therapy approaches</li>
                <li>• Provide alternative coping strategies</li>
                <li>• Connect patients to peer support networks</li>
              </ul>
            </div>

            {/* For Communities */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3">For Communities</h4>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Normalize conversations about male mental health</li>
                <li>• Support workplace wellness programs</li>
                <li>• Share this research with local leaders</li>
                <li>• Advocate for integrated treatment approaches</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DataInsights;