import React, { useState } from 'react';
import './BloodBankPanel.css';

const BLOOD_GROUP_FIELDS = {
  'A+': 'a_pos', 'A-': 'a_neg',
  'B+': 'b_pos', 'B-': 'b_neg',
  'AB+': 'ab_pos', 'AB-': 'ab_neg',
  'O+': 'o_pos', 'O-': 'o_neg',
};

export default function BloodBankPanel({ bloodBanks, requiredBloodGroup, onNotification }) {
  const [selectedBank, setSelectedBank] = useState(null);
  const [requestSent, setRequestSent]   = useState(null);

  const handleSelect = (bank) => {
    setSelectedBank(bank);
    setRequestSent(null);
  };

  const getUnits = (bank, group) => {
    const field = BLOOD_GROUP_FIELDS[group];
    return field ? (bank[field] || 0) : 0;
  };

  const handleRequest = (type) => {
    if (!selectedBank) return;
    const now   = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const units = getUnits(selectedBank, requiredBloodGroup);
    let message;
    if (type === 'dispatch') {
      message = {
        type: 'success', icon: '✓',
        text: `${selectedBank.name} notified. ${units} units of ${requiredBloodGroup} being dispatched to hospital. ETA ~${selectedBank.distance_km < 3 ? '10' : '18'} min. [${now}]`,
      };
    } else {
      message = {
        type: 'info', icon: '✓',
        text: `${requiredBloodGroup} blood units ready for ambulance pickup at ${selectedBank.name}. Route confirmed. [${now}]`,
      };
    }
    setRequestSent(type);
    onNotification(message);
  };

  return (
    <div className="blood-card card">
      <div className="card-title">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <path d="M8 2C8 2 3 6.5 3 10a5 5 0 0010 0C13 6.5 8 2 8 2z"
            stroke="#E24B4A" strokeWidth="1" fill="#FCEBEB" />
        </svg>
        Blood Bank Availability
        <span className="required-group-badge">{requiredBloodGroup} Required</span>
      </div>

      {bloodBanks.length === 0 ? (
        <div className="no-banks">No blood banks with {requiredBloodGroup} available nearby.</div>
      ) : (
        <>
          {bloodBanks.map(bb => {
            const units = getUnits(bb, requiredBloodGroup);
            return (
              <div
                key={bb.id}
                className={`blood-bank-row ${selectedBank && selectedBank.id === bb.id ? 'selected' : ''}`}
                onClick={() => handleSelect(bb)}
              >
                <div className="bb-header">
                  <div className="bb-name">{bb.name}</div>
                  <div className="bb-distance">{bb.distance_km} km away</div>
                </div>

                {/* Contact number */}
                {bb.phone && (
                  <div className="bb-phone">
                    <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
                      <path d="M2 2.5A1.5 1.5 0 013.5 1h1a1.5 1.5 0 011.5 1.5v.5a1.5 1.5 0 01-1.5 1.5 7 7 0 004 4A1.5 1.5 0 0110 10h.5A1.5 1.5 0 0112 11.5v1A1.5 1.5 0 0110.5 14C5.25 14 1 9.75 1 4.5A1.5 1.5 0 012.5 3H2z"
                        stroke="currentColor" strokeWidth="1" fill="none"/>
                    </svg>
                    {bb.phone}
                  </div>
                )}

                {/* Required blood group units highlighted */}
                <div className="bb-units-highlight">
                  <span className="bb-units-label">{requiredBloodGroup} available:</span>
                  <span className="bb-units-count">{units} units</span>
                </div>

                {/* All blood group pills */}
                <div className="blood-pills">
                  {Object.entries(BLOOD_GROUP_FIELDS).map(([group, field]) => {
                    const qty = bb[field] || 0;
                    if (qty === 0) return null;
                    return (
                      <span
                        key={group}
                        className={`blood-pill ${group === requiredBloodGroup ? 'blood-pill-highlight' : ''}`}
                      >
                        {group}: {qty}u
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {selectedBank && (
            <div className="workflow-section">
              <div className="workflow-header">
                Request from: <strong>{selectedBank.name}</strong>
              </div>
              <button
                className={`workflow-btn dispatch ${requestSent === 'dispatch' ? 'sent' : ''}`}
                onClick={() => handleRequest('dispatch')}
                disabled={requestSent !== null}
              >
                {requestSent === 'dispatch' ? '✓ Dispatched to Hospital' : 'Dispatch Blood to Hospital'}
              </button>
              <button
                className={`workflow-btn pickup ${requestSent === 'pickup' ? 'sent' : ''}`}
                onClick={() => handleRequest('pickup')}
                disabled={requestSent !== null}
              >
                {requestSent === 'pickup' ? '✓ Ready for Pickup' : 'Prepare for Ambulance Pickup'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
