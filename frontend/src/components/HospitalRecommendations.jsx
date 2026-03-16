import React from 'react';
import './HospitalRecommendations.css';

function Badge({ type, children }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

export default function HospitalRecommendations({ hospitals, selectedId, onSelect, requiredSpecialist }) {
  return (
    <div className="hosp-card card">
      <div className="card-title">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" />
          <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
        Recommended Hospitals
        {requiredSpecialist && (
          <span className="specialist-needed-badge">{requiredSpecialist} needed</span>
        )}
      </div>

      {hospitals.length === 0 && (
        <div className="no-hospitals">No hospitals found. Ensure hospital data is loaded.</div>
      )}

      {hospitals.map((h, i) => (
        <div
          key={h.id}
          className={`hospital-row ${selectedId === h.id ? 'selected' : ''}`}
          onClick={() => onSelect(h)}
        >
          {/* Rank circle */}
          <div className={`hospital-rank rank-${i + 1}`}>{i + 1}</div>

          <div className="hospital-info">
            <div className="hospital-name">{h.name}</div>
            <div className="hospital-meta">
              {h.distance_km} km &nbsp;·&nbsp; {h.travel_time_min} min ETA
            </div>

            {/* Specialist match — most important line */}
            {h.required_specialist_label && (
              <div className={`specialist-match ${h.required_specialist_available ? 'match-yes' : 'match-no'}`}>
                {h.required_specialist_available
                  ? `✓ ${h.required_specialist_label} available`
                  : `✕ No ${h.required_specialist_label}`}
              </div>
            )}

            <div className="hospital-badges">
              {h.icu_available
                ? <Badge type="green">ICU</Badge>
                : <Badge type="red">No ICU</Badge>
              }
              <Badge type="amber">{h.beds_available} beds</Badge>
              {h.trauma_specialist && <Badge type="blue">Trauma Specialist</Badge>}
              {h.has_cardiologist          && <Badge type="blue">Cardiologist</Badge>}
              {h.has_neurosurgeon          && <Badge type="blue">Neurosurgeon</Badge>}
              {h.has_gynaecologist         && <Badge type="pink">Gynaecologist</Badge>}
              {h.has_burn_specialist       && <Badge type="amber">Burn Specialist</Badge>}
              {h.has_orthopaedic_surgeon   && <Badge type="gray">Orthopaedic</Badge>}
              {h.has_toxicologist          && <Badge type="gray">Toxicologist</Badge>}
              {h.has_cardiothoracic_surgeon && <Badge type="blue">CT Surgeon</Badge>}
              <Badge type="gray">{h.emergency_status}</Badge>
            </div>
          </div>

          <div className="hospital-score">
            {h.recommendation_score}
            <span>score</span>
          </div>
        </div>
      ))}
    </div>
  );
}