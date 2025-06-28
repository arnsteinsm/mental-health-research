import React from 'react';
import Navigation from './components/Navigation';
import CorrectedHero from './components/CorrectedHero';
import DataIntegrityWarning from './components/DataIntegrityWarning';
import FactCheckReport from './components/FactCheckReport';
import ExecutiveSummary from './components/ExecutiveSummary';
import InteractiveVisualization from './components/InteractiveVisualization';
import CorrelationExplanation from './components/CorrelationExplanation';
import GenderAnalysis from './components/GenderAnalysis';
import DataTable from './components/DataTable';
import Conclusions from './components/Conclusions';
import DownloadCTA from './components/DownloadCTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <CorrectedHero />
      
      {/* Data Integrity Warning - Prominent Placement */}
      <div id="data-integrity">
        <DataIntegrityWarning />
      </div>
      
      {/* Complete Fact-Check Report */}
      <FactCheckReport />
      
      {/* Original Components - Now with Corrected Data */}
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
      
      {/* Strategic CTA Placement - Bottom Center */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <DownloadCTA variant="footer" />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default App;