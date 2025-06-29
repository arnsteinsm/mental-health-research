import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ExecutiveSummary from './components/ExecutiveSummary';
import DataInsights from './components/DataInsights';
import InteractiveVisualization from './components/InteractiveVisualization';
import GenderAnalysis from './components/GenderAnalysis';
import SolutionsFocus from './components/SolutionsFocus';
import Conclusions from './components/Conclusions';
import Footer from './components/Footer';
import ShareButton from './components/ShareButton';
import CallToAction from './components/DownloadCTA';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <div id="executive-summary">
        <ExecutiveSummary />
      </div>
      <div id="data-insights">
        <DataInsights />
      </div>
      <div id="visualization">
        <InteractiveVisualization />
      </div>
      <div id="gender-analysis">
        <GenderAnalysis />
      </div>
      <div id="solutions">
        <SolutionsFocus />
      </div>
      <div id="conclusions">
        <Conclusions />
      </div>
      
      {/* Strategic CTA Placement - Bottom Center */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <CallToAction variant="footer" />
        </div>
      </section>
      
      <Footer />
      
      {/* Floating Share Button */}
      <ShareButton variant="floating" />
    </div>
  );
}

export default App;