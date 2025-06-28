import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ExecutiveSummary from './components/ExecutiveSummary';
import InteractiveVisualization from './components/InteractiveVisualization';
import CorrelationExplanation from './components/CorrelationExplanation';
import GenderAnalysis from './components/GenderAnalysis';
import DataTable from './components/DataTable';
import Conclusions from './components/Conclusions';

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
      <div id="data-table">
        <DataTable />
      </div>
      <div id="conclusions">
        <Conclusions />
      </div>
    </div>
  );
}

export default App;