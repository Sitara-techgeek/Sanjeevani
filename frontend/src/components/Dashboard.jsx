import React from 'react';
import SeverityPanel from './SeverityPanel';
import AmbulanceMap from './AmbulanceMap';
import HospitalRecommendations from './HospitalRecommendations';
import StatusFeed from './StatusFeed';
import './Dashboard.css';

export default function Dashboard({
  triageResult,
  formData,
  recommendations,
  selectedHospital,
  onSelectHospital,
  hospitals,
  bloodBanks,
  notifications,
}) {
  if (!triageResult) {
    return (
      <div className="dashboard-placeholder card">
        <div className="placeholder-icon">
          <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
            <path d="M24 14v10l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="placeholder-title">Enter patient data and run triage</div>
        <div className="placeholder-sub">
          AI will analyze vitals and recommend the most suitable hospital
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <SeverityPanel triageResult={triageResult} formData={formData} />

      <div className="dashboard-two-col">
        <AmbulanceMap
          hospitals={hospitals}
          bloodBanks={bloodBanks}
          selectedHospital={selectedHospital}
        />
        <HospitalRecommendations
          hospitals={recommendations}
          selectedId={selectedHospital?.id}
          onSelect={onSelectHospital}
        />
      </div>

      <StatusFeed notifications={notifications} />
    </div>
  );
}