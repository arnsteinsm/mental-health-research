import React, { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { getSourcesForClaim } from '../data/evidence-sources';
import EvidenceModal from './EvidenceModal';

interface EvidenceButtonProps {
  claimId: string;
  claimTitle: string;
  variant?: 'inline' | 'block';
}

const EvidenceButton: React.FC<EvidenceButtonProps> = ({ 
  claimId, 
  claimTitle, 
  variant = 'inline' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sources = getSourcesForClaim(claimId);

  if (sources.length === 0) {
    return null;
  }

  const buttonClass = variant === 'inline' 
    ? "inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors ml-2"
    : "inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors";

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={buttonClass}
      >
        <FileText className="w-3 h-3 mr-1" />
        {sources.length} source{sources.length > 1 ? 's' : ''}
      </button>

      <EvidenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sources={sources}
        claimTitle={claimTitle}
      />
    </>
  );
};

export default EvidenceButton;