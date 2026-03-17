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

            {/* Specialist match line */}
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

            {/* Badges — ICU and beds always show, specialists only show if hospital has them */}
            <div className="hospital-badges">
              <Badge available={h.icu_available}      label="ICU" />
              <Badge available={h.beds_available > 0} label={`${h.beds_available} beds`} />
              {h.has_cardiologist            && <Badge available={true} label="Cardiologist" />}
              {h.has_neurosurgeon            && <Badge available={true} label="Neurosurgeon" />}
              {h.has_gynaecologist           && <Badge available={true} label="Gynaecologist" />}
              {h.has_general_surgeon         && <Badge available={true} label="General Surgeon" />}
              {h.has_burn_specialist         && <Badge available={true} label="Burn Specialist" />}
              {h.has_orthopaedic_surgeon     && <Badge available={true} label="Orthopaedic" />}
              {h.has_cardiothoracic_surgeon  && <Badge available={true} label="CT Surgeon" />}
              {h.has_toxicologist            && <Badge available={true} label="Toxicologist" />}
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
