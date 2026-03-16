import React from 'react';
import './SeverityPanel.css';

function VitalCard({ label, value, unit, status }) {
  return (
    <div className={`vital-card vital-${status}`}>
      <div className="vital-value">{value}<span className="vital-unit">{unit}</span></div>
      <div className="vital-label">{label}</div>
      <div className={`vital-indicator vital-indicator-${status}`} />
    </div>
  );
}

function getVitalStatus(type, value) {
  if (type === 'hr') {
    if (value > 150 || value < 40) return 'danger';
    if (value > 120 || value < 50) return 'warn';
    if (value > 100) return 'caution';
    return 'ok';
  }
  if (type === 'spo2') {
    if (value < 90) return 'danger';
    if (value < 95) return 'warn';
    return 'ok';
  }
  if (type === 'sys') {
    if (value < 90) return 'danger';
    if (value < 110) return 'warn';
    if (value > 180) return 'warn';
    return 'ok';
  }
  return 'ok';
}

const SEVERITY_CONFIG = {
  Critical: { className: 'critical', icon: '⚠', label: 'Critical' },
  Moderate: { className: 'moderate', icon: '◉', label: 'Moderate' },
  Stable:   { className: 'stable',   icon: '✓', label: 'Stable'   },
};

export default function SeverityPanel({ triageResult, formData }) {
  if (!triageResult) return null;
  const { severity, reasons } = triageResult;
  const config = SEVERITY_CONFIG[severity];
  const sys  = parseInt((formData.bloodPressure || '120/80').split('/')[0]) || 120;
  const hr   = parseInt(formData.heartRate) || 75;
  const spo2 = parseInt(formData.spo2) || 98;

  return (
    <div className="severity-panel card">
      <div className="severity-header">
        <div className="card-title" style={{ marginBottom: 0 }}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <rect x="1" y="1" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1" />
            <path d="M4 8h2l1.5-3 2 6 1.5-3H12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          AI Severity Assessment
        </div>
        <div className={`severity-badge severity-${config.className}`}>
          <span className="severity-icon">{config.icon}</span>
          {config.label}
        </div>
      </div>
      <div className="vital-grid">
        <VitalCard label="Heart Rate"     value={hr}                    unit=" bpm" status={getVitalStatus('hr', hr)} />
        <VitalCard label="Blood Pressure" value={formData.bloodPressure} unit=""    status={getVitalStatus('sys', sys)} />
        <VitalCard label="SpO2"           value={spo2}                   unit="%"   status={getVitalStatus('spo2', spo2)} />
        <VitalCard label="Blood Group"    value={formData.bloodGroup}    unit=""    status="ok" />
      </div>
      {reasons && reasons.length > 0 && (
        <div className="reasons-list">
          {reasons.map((r, i) => (
            <div key={i} className={`reason-item reason-${severity.toLowerCase()}`}>
              <span className="reason-dot" />{r}
            </div>
          ))}
        </div>
      )}
      <div className="ecg-container">
        <svg viewBox="0 0 400 44" width="100%" height="44" preserveAspectRatio="none">
          <path className="ecg-line"
            d="M0,22 L28,22 L33,22 L38,4 L43,40 L48,22 L60,22 L68,22 L72,19 L76,25 L80,22 L98,22 L103,22 L108,4 L113,40 L118,22 L130,22 L135,19 L139,25 L143,22 L165,22 L170,22 L175,4 L180,40 L185,22 L200,22 L205,19 L209,25 L213,22 L235,22 L240,4 L245,40 L250,22 L265,22 L270,19 L275,25 L280,22 L300,22 L305,22 L310,4 L315,40 L320,22 L340,22 L345,19 L350,25 L355,22 L375,22 L380,4 L385,40 L390,22 L400,22"
            stroke="#E24B4A" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    </div>
  );
}