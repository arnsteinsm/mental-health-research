import React from 'react';
import Navigation from './components/Navigation';
import CorrectedHero from './components/CorrectedHero';
import DataIntegrityWarning from './components/DataIntegrityWarning';
import InteractiveVisualization from './components/InteractiveVisualization';
import DataTable from './components/DataTable';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <CorrectedHero />
      <div id="data-integrity">
        <DataIntegrityWarning />
      </div>
      <div id="visualization">
        <InteractiveVisualization />
      </div>
      <div id="data-table">
        <DataTable />
      </div>
      <Footer />
    </div>
  );
}

export default App;