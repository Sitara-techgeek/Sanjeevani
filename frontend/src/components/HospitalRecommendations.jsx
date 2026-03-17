import React from 'react';
import './HospitalRecommendations.css';

function Badge({ available, label }) {
  return (
    <span className={`badge ${available ? 'badge-green' : 'badge-red'}`}>
      {label}
    </span>
  );
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
          <div className={`hospital-rank rank-${i + 1}`}>{i + 1}</div>

          <div className="hospital-info">
            <div className="hospital-name">{h.name}</div>
            <div className="hospital-meta">
              {h.distance_km} km &nbsp;·&nbsp; {h.travel_time_min} min ETA
            </div>

            {/* Specialist match */}
            {h.required_specialist_label && (
              <div className={`specialist-match ${h.required_specialist_available ? 'match-yes' : 'match-no'}`}>
                {h.required_specialist_available
                  ? `✓ ${h.required_specialist_label} available`
                  : `✕ No ${h.required_specialist_label}`}
                {h.specialist_shift && (
                  <span className="shift-label"> — {h.specialist_shift}</span>
                )}
              </div>
            )}

            {/* Badges — green if available, red if not — removed trauma specialist and active tags */}
            <div className="hospital-badges">
              <Badge available={h.icu_available}          label="ICU" />
              <Badge available={h.beds_available > 0}     label={`${h.beds_available} beds`} />
              <Badge available={h.has_cardiologist}       label="Cardiologist" />
              <Badge available={h.has_neurosurgeon}       label="Neurosurgeon" />
              <Badge available={h.has_gynaecologist}      label="Gynaecologist" />
              <Badge available={h.has_general_surgeon}    label="General Surgeon" />
              <Badge available={h.has_burn_specialist}    label="Burn Specialist" />
              <Badge available={h.has_orthopaedic_surgeon} label="Orthopaedic" />
              <Badge available={h.has_cardiothoracic_surgeon} label="CT Surgeon" />
              <Badge available={h.has_toxicologist}       label="Toxicologist" />
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
