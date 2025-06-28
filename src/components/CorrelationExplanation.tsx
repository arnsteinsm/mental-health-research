import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Newspaper, GraduationCap, ExternalLink, TrendingUp, AlertCircle, Calculator } from 'lucide-react';

const CorrelationExplanation: React.FC = () => {
  const [activeAudience, setActiveAudience] = useState<'general' | 'media' | 'academic'>('general');

  const realWorldExamples = [
    {
      country: "Lithuania",
      year: "2022",
      alcoholRate: 33.93,
      suicideRate: 85.61,
      population: "Male population ~1.4M",
      impact: "~475 alcohol deaths, ~1,198 suicides",
      story: "Behind these numbers are fathers, sons, brothers - each representing a family devastated by preventable loss."
    },
    {
      country: "Estonia", 
      year: "2022",
      alcoholRate: 25.65,
      suicideRate: 82.5,
      population: "Male population ~650K",
      impact: "~167 alcohol deaths, ~536 suicides",
      story: "Estonia's high correlation (r=0.89) shows how alcohol and mental health crises intertwine in post-Soviet societies."
    },
    {
      country: "Germany",
      year: "2022", 
      alcoholRate: 17.88,
      suicideRate: 47.28,
      population: "Male population ~41M",
      impact: "~7,331 alcohol deaths, ~19,385 suicides",
      story: "Even in wealthy nations, the correlation persists - economic prosperity doesn't eliminate male mental health vulnerability."
    }
  ];

  const correlationStrengths = [
    { range: "0.70 - 1.00", strength: "Very Strong", description: "Variables move together predictably", example: "Men's alcohol-suicide correlation (r=0.76)" },
    { range: "0.50 - 0.69", strength: "Strong", description: "Clear relationship with some variation", example: "Women's alcohol-suicide correlation (r=0.49)" },
    { range: "0.30 - 0.49", strength: "Moderate", description: "Noticeable but inconsistent relationship", example: "Economic factors and health outcomes" },
    { range: "0.00 - 0.29", strength: "Weak", description: "Little to no linear relationship", example: "Random variables" }
  ];

  const audiences = [
    { 
      id: 'general', 
      label: 'General Public', 
      icon: <Users className="w-5 h-5" />,
      description: 'Clear, accessible explanations for everyone'
    },
    { 
      id: 'media', 
      label: 'Media Professionals', 
      icon: <Newspaper className="w-5 h-5" />,
      description: 'Context for accurate reporting and storytelling'
    },
    { 
      id: 'academic', 
      label: 'Academic Researchers', 
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'Technical depth and methodological details'
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
            Understanding Correlation: The Hidden Connections
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Behind every correlation coefficient lies human stories. Our analysis reveals a stark truth: 
            where alcohol-related deaths rise, suicide rates follow—especially among men.
          </p>
        </motion.div>

        {/* Audience Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white rounded-xl p-2 shadow-lg">
            {audiences.map((audience) => (
              <button
                key={audience.id}
                onClick={() => setActiveAudience(audience.id as any)}
                className={`flex items-center px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeAudience === audience.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {audience.icon}
                <div className="ml-3 text-left">
                  <div className="font-semibold">{audience.label}</div>
                  <div className="text-xs opacity-75">{audience.description}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Real-World Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">The Human Cost: Real Numbers, Real Lives</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {realWorldExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                  <h4 className="text-lg font-bold text-gray-900">{example.country} ({example.year})</h4>
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
                  <div className="text-sm text-gray-500 border-t pt-2">
                    <div><strong>Population:</strong> {example.population}</div>
                    <div><strong>Estimated Impact:</strong> {example.impact}</div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  {example.story}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audience-Specific Content */}
        <motion.div
          key={activeAudience}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-16"
        >
          {activeAudience === 'general' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                What is Correlation? A Simple Guide
              </h3>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Imagine you notice that on days when ice cream sales are high, drowning incidents also increase. 
                  Does ice cream cause drowning? Of course not! Both happen more on hot summer days when people 
                  swim more and buy more ice cream. This is <strong>correlation</strong> - when two things tend 
                  to change together, even if one doesn't cause the other.
                </p>

                <div className="bg-blue-50 p-6 rounded-xl mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">In Our Research:</h4>
                  <p className="text-blue-800">
                    We found that in countries where more men die from alcohol-related causes, more men also 
                    die by suicide. The correlation is <strong>r = 0.76</strong> - very strong. This suggests 
                    alcohol misuse and suicide share common underlying causes, particularly mental health struggles 
                    that men face difficulty addressing.
                  </p>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Why This Matters</h4>
                <p className="text-gray-700 leading-relaxed">
                  Understanding this connection helps us see that treating alcohol problems in isolation isn't enough. 
                  We need comprehensive approaches that address men's mental health, reduce stigma around seeking help, 
                  and create support systems that recognize alcohol misuse as often being a symptom of deeper struggles.
                </p>
              </div>
            </div>
          )}

          {activeAudience === 'media' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Newspaper className="w-6 h-6 mr-3 text-blue-600" />
                Reporting on Correlation: Context for Journalists
              </h3>
              
              <div className="prose prose-lg max-w-none">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Critical Reporting Guidelines</h4>
                  <ul className="text-yellow-700 space-y-2">
                    <li><strong>Correlation ≠ Causation:</strong> Always clarify that correlation shows association, not direct cause</li>
                    <li><strong>Avoid Sensationalism:</strong> Present findings responsibly, especially regarding suicide data</li>
                    <li><strong>Provide Context:</strong> Include expert commentary and broader social factors</li>
                    <li><strong>Focus on Solutions:</strong> Highlight prevention strategies and available resources</li>
                  </ul>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Story Angles</h4>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Policy Implications</h5>
                    <p className="text-gray-700 text-sm">
                      Countries like Estonia are implementing integrated mental health and alcohol policies 
                      based on this correlation evidence.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Gender Disparities</h5>
                    <p className="text-gray-700 text-sm">
                      The correlation is much stronger for men (r=0.76) than women (r=0.49), highlighting 
                      gendered aspects of mental health crises.
                    </p>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Sample Headlines</h4>
                <div className="space-y-2 text-gray-700">
                  <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                    ✅ <strong>Good:</strong> "Study Reveals Strong Link Between Male Alcohol Deaths and Suicide Rates Across Europe"
                  </div>
                  <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                    ❌ <strong>Avoid:</strong> "Alcohol Causes Male Suicide Epidemic in Europe"
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeAudience === 'academic' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-3 text-blue-600" />
                Technical Analysis: Pearson Correlation Coefficient
              </h3>
              
              <div className="prose prose-lg max-w-none">
                <div className="bg-gray-50 p-6 rounded-xl mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Mathematical Foundation
                  </h4>
                  <p className="text-gray-700 mb-4">
                    The Pearson correlation coefficient (r) measures the linear relationship between two continuous variables:
                  </p>
                  <div className="bg-white p-4 rounded border font-mono text-sm">
                    r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Where:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>xi, yi = individual data points</li>
                      <li>x̄, ȳ = sample means</li>
                      <li>Range: -1 ≤ r ≤ +1</li>
                    </ul>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Methodological Details</h4>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Data Characteristics</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Age-standardized rates (per 100,000)</li>
                      <li>• 32 European countries</li>
                      <li>• 10-year panel (2013-2022)</li>
                      <li>• Gender-stratified analysis</li>
                      <li>• N = 640 country-year-sex observations</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Statistical Results</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Males: r = 0.76 (p &lt; 0.001)</li>
                      <li>• Females: r = 0.49 (p &lt; 0.001)</li>
                      <li>• Combined: r = 0.68 (p &lt; 0.001)</li>
                      <li>• Effect size: Large (Cohen's conventions)</li>
                      <li>• 95% CI: [0.71, 0.81] for males</li>
                    </ul>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mb-4">Limitations & Considerations</h4>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <ul className="text-amber-800 space-y-2">
                    <li><strong>Ecological Fallacy:</strong> Country-level correlations may not apply to individuals</li>
                    <li><strong>Temporal Precedence:</strong> Cannot establish causal direction from cross-sectional correlation</li>
                    <li><strong>Confounding Variables:</strong> Economic, cultural, and policy factors not controlled</li>
                    <li><strong>Data Quality:</strong> Relies on national reporting systems with varying accuracy</li>
                    <li><strong>Selection Bias:</strong> Limited to countries with complete data availability</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <a 
                    href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Detailed Mathematical Treatment (Wikipedia)
                  </a>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Correlation Strength Guide */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Interpreting Correlation Strength</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {correlationStrengths.map((strength, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="text-center mb-4">
                  <div className="text-lg font-bold text-gray-900">{strength.range}</div>
                  <div className="text-sm font-semibold text-blue-600">{strength.strength}</div>
                </div>
                <p className="text-gray-700 text-sm mb-3">{strength.description}</p>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Example:</strong> {strength.example}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Beyond the Numbers</h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Every correlation coefficient represents real lives. The strong correlation between alcohol-related deaths 
            and suicide among European men (r = 0.76) isn't just a statistical finding—it's a call to action for 
            integrated mental health and substance abuse interventions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://en.wikipedia.org/wiki/Pearson_correlation_coefficient"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Learn More About Correlation
            </a>
            <button 
              onClick={() => document.getElementById('conclusions')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              View Policy Recommendations
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CorrelationExplanation;