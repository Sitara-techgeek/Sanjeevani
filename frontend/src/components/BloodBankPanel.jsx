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
        type: 'success',
        icon: '✓',
        text: `${selectedBank.name} notified. ${units} units of ${requiredBloodGroup} being dispatched to hospital. ETA ~${selectedBank.distance_km < 3 ? '10' : '18'} min. [${now}]`,
      };
    } else {
      message = {
        type: 'info',
        icon: '✓',
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
        <div className="no-banks">
          No blood banks with {requiredBloodGroup} available nearby.
        </div>
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
                  <div className="bb-distance">{bb.distance_km} km</div>
                </div>
                <div className="bb-meta">{bb.address}</div>
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