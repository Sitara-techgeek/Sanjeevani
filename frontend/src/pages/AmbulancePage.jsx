import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Header from '../components/Header';
import PatientInputPanel from '../components/PatientInputPanel';
import SeverityPanel from '../components/SeverityPanel';
import LeafletMap from '../components/LeafletMap';
import HospitalRecommendations from '../components/HospitalRecommendations';
import BloodBankPanel from '../components/BloodBankPanel';
import StatusFeed from '../components/StatusFeed';
import { triageAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './AmbulancePage.css';

const DEFAULT_FORM = {
  heartRate: '', bloodPressure: '', spo2: '',
  bloodGroup: 'O+', traumaType: 'Heavy Bleeding',
  consciousness: 'Alert',
};

export default function AmbulancePage() {
  const { user } = useAuth();
  const socketRef = useRef(null);

  const [form, setForm]                         = useState(DEFAULT_FORM);
  const [triageResult, setTriageResult]         = useState(null);
  const [recommendations, setRecommendations]   = useState([]);
  const [bloodBanks, setBloodBanks]             = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showBlood, setShowBlood]               = useState(false);
  const [notifications, setNotifications]       = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [ambulancePos, setAmbulancePos]         = useState(null);

  // Real-time GPS via browser + Socket.io
  useEffect(() => {
    if (!navigator.geolocation) return;

    // Connect Socket.io to backend
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:8000');
    socketRef.current = socket;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setAmbulancePos(coords);
        // Emit location to server via Socket.io
        socket.emit('location_update', {
          userId: user?.id,
          latitude: coords.lat,
          longitude: coords.lng,
        });
      },
      null,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      socket.disconnect();
    };
  }, [user]);

  const addNotif = (n) => setNotifications(prev => [n, ...prev]);

  const runTriage = async () => {
    if (!ambulancePos) {
      addNotif({ type: 'warning', icon: '⚠', text: 'Waiting for GPS location...' });
      return;
    }
    setLoading(true);
    try {
      const res = await triageAPI.run({
        heart_rate:     parseInt(form.heartRate),
        blood_pressure: form.bloodPressure,
        spo2:           parseInt(form.spo2),
        trauma_type:    form.traumaType,
        consciousness:  form.consciousness,
        blood_group:    form.bloodGroup,
        latitude:       ambulancePos.lat,
        longitude:      ambulancePos.lng,
      });
      const d = res.data;
      setTriageResult(d);
      setRecommendations(d.recommended_hospitals);
      setSelectedHospital(d.recommended_hospitals[0]);
      setBloodBanks(d.compatible_blood_banks);
      setShowBlood(d.requires_blood);
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      setNotifications([
        { type: 'warning', icon: '⚡', text: `[${now}] Severity: ${d.severity}. Trauma: ${form.traumaType}.` },
        { type: 'info',    icon: '🏥', text: `[${now}] Top: ${d.recommended_hospitals[0]?.name} — score ${d.recommended_hospitals[0]?.recommendation_score}` },
        ...(d.requires_blood ? [{ type: 'danger', icon: '🩸', text: `[${now}] ${form.bloodGroup} needed. ${d.compatible_blood_banks.length} bank(s) found.` }] : []),
      ]);
    } catch (err) {
      addNotif({ type: 'danger', icon: '✕', text: err.response?.data?.detail || 'Triage failed. Check connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="amb-wrapper">
      <Header role="ambulance" />
      <div className="amb-container">
        <div className="amb-left">
          <PatientInputPanel formData={form} onChange={setForm} onSubmit={runTriage} loading={loading} />
          {showBlood && triageResult && (
            <BloodBankPanel bloodBanks={bloodBanks} requiredBloodGroup={form.bloodGroup} onNotification={addNotif} />
          )}
        </div>
        <div className="amb-right">
          {!triageResult ? (
            <div className="placeholder card">
              <div className="placeholder-icon" style={{opacity:0.22,margin:'0 auto 14px',width:'fit-content'}}>
                <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M24 14v10l6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{fontSize:15,fontWeight:500,marginBottom:6}}>Enter patient data and run triage</div>
              <div style={{fontSize:13,color:'var(--text-secondary)'}}>
                GPS is {ambulancePos ? '✓ active' : 'acquiring...'}
              </div>
            </div>
          ) : (
            <>
              <SeverityPanel triageResult={triageResult} formData={form} />
              <div className="amb-two-col">
                <LeafletMap
                  ambulancePos={ambulancePos}
                  hospitals={recommendations}
                  bloodBanks={bloodBanks}
                  selectedHospital={selectedHospital}
                />
                <HospitalRecommendations
                  hospitals={recommendations}
                  selectedId={selectedHospital?.id}
                  onSelect={setSelectedHospital}
                  requiredSpecialist={triageResult?.required_specialist}
                />
              </div>
              <StatusFeed notifications={notifications} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}