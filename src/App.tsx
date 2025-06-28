import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ExecutiveSummary from './components/ExecutiveSummary';
import InteractiveVisualization from './components/InteractiveVisualization';
import CorrelationExplanation from './components/CorrelationExplanation';
import GenderAnalysis from './components/GenderAnalysis';
import Conclusions from './components/Conclusions';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <div id="executive-summary">
        <ExecutiveSummary />
      </div>
      <div id="visualization">
        <InteractiveVisualization />
      </div>
      <div id="correlation">
        <CorrelationExplanation />
      </div>
      <div id="gender-analysis">
        <GenderAnalysis />
      </div>
      <div id="conclusions">
        <Conclusions />
      </div>
      <Footer />
    </div>
  );
}

export default App;