import React from 'react';
import './PatientInputPanel.css';

const TRAUMA_TYPES = [
  'Cardiac Emergency',
  'Head Injury',
  'Heavy Bleeding',
  'Maternal Emergency',
  'Burn Injury',
  'Spinal Injury',
  'Chest Trauma',
  'Fracture',
  'Poisoning',
  'Other',
];

const CONSCIOUSNESS_LEVELS = ['Unresponsive', 'Responds to Pain', 'Confused', 'Alert'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Which trauma types require blood group input
const BLOOD_RELEVANT = ['Heavy Bleeding', 'Maternal Emergency', 'Cardiac Emergency', 'Chest Trauma'];

export default function PatientInputPanel({ formData, onChange, onSubmit, loading }) {
  const handleChange = (field, value) => onChange({ ...formData, [field]: value });
  const showBloodGroup = BLOOD_RELEVANT.includes(formData.traumaType);

  return (
    <div className="input-panel card">
      <div className="card-title">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1" />
          <path d="M5 8h2l1-2 1 3 1-1h1" stroke="currentColor" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Patient Data Input
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Heart Rate (bpm)</label>
          <input type="number" value={formData.heartRate}
            onChange={e => handleChange('heartRate', e.target.value)}
            min="20" max="250" placeholder="e.g. 85" />
        </div>
        <div className="form-group">
          <label>Blood Pressure</label>
          <input type="text" value={formData.bloodPressure}
            onChange={e => handleChange('bloodPressure', e.target.value)}
            placeholder="e.g. 120/80" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>SpO2 (%)</label>
          <input type="number" value={formData.spo2}
            onChange={e => handleChange('spo2', e.target.value)}
            min="50" max="100" placeholder="e.g. 98" />
        </div>
        <div className="form-group">
          <label>Consciousness</label>
          <select value={formData.consciousness}
            onChange={e => handleChange('consciousness', e.target.value)}>
            {CONSCIOUSNESS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Trauma Type</label>
        <select value={formData.traumaType}
          onChange={e => handleChange('traumaType', e.target.value)}>
          {TRAUMA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Specialist hint */}
      {formData.traumaType && (
        <div className="specialist-hint">
          <svg viewBox="0 0 12 12" fill="none" width="12" height="12">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
            <path d="M6 5v4M6 3.5v.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          {getSpecialistHint(formData.traumaType)}
        </div>
      )}

      <div className="form-group" style={{ marginTop: 10 }}>
        <label>Blood Group</label>
        <select value={formData.bloodGroup}
          onChange={e => handleChange('bloodGroup', e.target.value)}>
          {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>
        {!showBloodGroup && (
          <span className="field-note">Blood group used if severe or bleeding detected</span>
        )}
      </div>

      <div className="form-group">
        <label>Ambulance Location</label>
        <input type="text" value={formData.location}
          onChange={e => handleChange('location', e.target.value)}
          placeholder="City name or GPS coordinates" />
      </div>

      <button className="btn-primary" onClick={onSubmit} disabled={loading}>
        {loading ? (
          <span className="btn-loading"><span className="btn-spinner" />Analyzing...</span>
        ) : 'Run AI Triage Analysis'}
      </button>
    </div>
  );
}

function getSpecialistHint(traumaType) {
  const map = {
    'Cardiac Emergency':     'Requires Cardiologist',
    'Head Injury':           'Requires Neurosurgeon',
    'Spinal Injury':         'Requires Neurosurgeon',
    'Heavy Bleeding':        'Requires General Surgeon',
    'Maternal Emergency':    'Requires Gynaecologist',
    'Burn Injury':           'Requires Burn Specialist',
    'Chest Trauma':          'Requires Cardiothoracic Surgeon',
    'Fracture':              'Requires Orthopaedic Surgeon',
    'Poisoning':             'Requires Toxicologist',
    'Other':                 'Requires General Surgeon',
  };
  return map[traumaType] || '';
}