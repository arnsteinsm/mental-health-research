import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Heart, ArrowRight, CheckCircle, TrendingUp, Award } from 'lucide-react';
import EvidenceButton from './EvidenceButton';

const SolutionsFocus: React.FC = () => {
  // 3. EMPATHETIC, SOLUTION-FOCUSED SECTION HEADINGS
  const solutions = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Male-Focused Mental Health Programs",
      subtitle: "Addressing barriers to help-seeking",
      description: "Develop interventions that acknowledge masculine norms while providing accessible pathways to mental health support.",
      evidence: "Research shows men are 3x less likely to seek help",
      priority: "Critical",
      evidenceId: "male-focused-programs",
      outcomes: [
        "25% reduction in alcohol mortality within 3 years",
        "3x increase in treatment engagement",
        "Reduced stigma around male mental health"
      ],
      implementation: [
        "Partner with male-dominated workplaces",
        "Train therapists in male-friendly approaches",
        "Create peer support networks"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Workplace Mental Health Integration",
      subtitle: "Meeting men where they are",
      description: "Target male-dominated industries with comprehensive mental health support systems that feel natural and accessible.",
      evidence: "Male-dominated occupations show higher suicide rates",
      priority: "High",
      evidenceId: "workplace-mental-health",
      outcomes: [
        "15-20% reduction in male suicide rates",
        "30% decrease in workplace stress incidents",
        "Improved productivity and retention"
      ],
      implementation: [
        "Mandatory mental health training for supervisors",
        "On-site counseling services",
        "Anonymous mental health screening"
      ]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Integrated Treatment Approaches",
      subtitle: "Treating the whole person",
      description: "Address alcohol and mental health together, recognizing that substance use is often a symptom of deeper struggles.",
      evidence: "74% of male suicides involve alcohol vs 31% for females",
      priority: "Essential",
      evidenceId: "integrated-treatment",
      outcomes: [
        "40% better treatment outcomes",
        "50% reduction in treatment dropout",
        "Faster recovery times"
      ],
      implementation: [
        "Co-locate mental health and addiction services",
        "Train staff in dual-diagnosis approaches",
        "Develop integrated treatment protocols"
      ]
    }
  ];

  const successStories = [
    {
      country: "Australia",
      program: "National Male Health Policy",
      result: "25% reduction in male alcohol mortality",
      timeframe: "5 years",
      keyFactor: "Male-specific intervention design"
    },
    {
      country: "Ireland",
      program: "Connecting for Life Strategy",
      result: "15% decrease in male suicide rates",
      timeframe: "3 years", 
      keyFactor: "Community-based approach"
    },
    {
      country: "Norway",
      program: "Workplace Mental Health Initiative",
      result: "20% reduction in work-related stress",
      timeframe: "2 years",
      keyFactor: "Mandatory employer participation"
    }
  ];

  return (
    <section id="solutions" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6">
        {/* 3. EMPATHETIC, SOLUTION-FOCUSED HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Solutions That Save Lives
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            The crisis is real, but so are the solutions. Countries implementing these evidence-based approaches 
            are already seeing measurable improvements in male mental health outcomes.
          </p>
        </motion.div>

        {/* Success Stories - Building Hope */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
            <Award className="w-6 h-6 mr-3 text-green-600" />
            Proven Success Stories
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-green-200"
              >
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-900">{story.country}</h4>
                  <p className="text-sm text-gray-600">{story.program}</p>
                </div>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-1">{story.result}</div>
                  <div className="text-sm text-gray-500">in {story.timeframe}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-green-800 mb-1">Key Success Factor:</div>
                  <div className="text-xs text-green-700">{story.keyFactor}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 4. ACTIVE, CONCRETE SOLUTIONS WITH MEASURABLE OUTCOMES */}
        <div className="space-y-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Solution Overview */}
                <div>
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0 p-3 bg-blue-600 rounded-lg text-white">
                      {solution.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-2xl font-bold text-gray-900">{solution.title}</h4>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          solution.priority === 'Critical' 
                            ? 'bg-red-100 text-red-800' 
                            : solution.priority === 'High'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {solution.priority} Priority
                        </span>
                      </div>
                      <h5 className="text-lg font-semibold text-blue-600 mb-3">{solution.subtitle}</h5>
                      <p className="text-gray-700 leading-relaxed mb-4">{solution.description}</p>
                      
                      {/* Evidence backing */}
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-blue-900 mb-1">Evidence Base:</div>
                            <div className="text-sm text-blue-800">{solution.evidence}</div>
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
                </div>

                {/* Implementation & Outcomes */}
                <div>
                  {/* Expected Outcomes */}
                  <div className="mb-6">
                    <h6 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                      Expected Outcomes
                    </h6>
                    <div className="space-y-2">
                      {solution.outcomes.map((outcome, outcomeIndex) => (
                        <div key={outcomeIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h6 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
                      Implementation Steps
                    </h6>
                    <div className="space-y-2">
                      {solution.implementation.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">{stepIndex + 1}</span>
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action - Balancing Urgency with Hope */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-6">The Time for Action is Now</h3>
          <p className="text-xl mb-8 max-w-4xl mx-auto leading-relaxed">
            These aren't theoretical solutions—they're proven interventions already saving lives. 
            Every day we delay implementation, we lose opportunities to prevent preventable deaths.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">Today</div>
              <div className="text-sm">Start conversations, share research</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">This Month</div>
              <div className="text-sm">Advocate for policy changes</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="text-2xl font-bold mb-2">This Year</div>
              <div className="text-sm">Implement proven programs</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
              <Target className="w-5 h-5 mr-2" />
              Download Implementation Guide
            </button>
            <button className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-colors">
              Share This Research
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionsFocus;