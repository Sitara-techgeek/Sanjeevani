import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import AdminFileUpload from '../components/AdminFileUpload';
import { hospitalAPI, bloodBankAPI } from '../api/client';
import './AdminPage.css';

export default function AdminPage() {
  const [hospitals, setHospitals]    = useState([]);
  const [bloodBanks, setBloodBanks]  = useState([]);
  const [tab, setTab]                = useState('hospitals');

  useEffect(() => {
    hospitalAPI.getAll().then(r => setHospitals(r.data));
    bloodBankAPI.getAll().then(r => setBloodBanks(r.data));
  }, []);

  const reload = () => {
    hospitalAPI.getAll().then(r => setHospitals(r.data));
    bloodBankAPI.getAll().then(r => setBloodBanks(r.data));
  };

  return (
    <div className="admin-wrapper">
      <Header role="admin" />
      <div className="admin-container">
        <div className="admin-tabs">
          <button className={`tab ${tab === 'hospitals'   ? 'active' : ''}`} onClick={() => setTab('hospitals')}>Hospitals ({hospitals.length})</button>
          <button className={`tab ${tab === 'bloodbanks'  ? 'active' : ''}`} onClick={() => setTab('bloodbanks')}>Blood Banks ({bloodBanks.length})</button>
          <button className={`tab ${tab === 'upload'      ? 'active' : ''}`} onClick={() => setTab('upload')}>Upload Files</button>
        </div>

        {tab === 'upload' && <AdminFileUpload onSuccess={reload} />}

        {tab === 'hospitals' && (
          <div className="admin-table-card card">
            <div className="card-title">Hospital Database</div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Address</th><th>Beds</th><th>ICU</th><th>Specialist</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {hospitals.map(h => (
                  <tr key={h.id}>
                    <td>{h.name}</td>
                    <td>{h.address}</td>
                    <td>{h.beds_available}</td>
                    <td><span className={`pill ${h.icu_available ? 'pill-green' : 'pill-red'}`}>{h.icu_available ? 'Yes' : 'No'}</span></td>
                    <td><span className={`pill ${h.trauma_specialist ? 'pill-green' : 'pill-gray'}`}>{h.trauma_specialist ? 'Yes' : 'No'}</span></td>
                    <td><span className="pill pill-blue">{h.emergency_status}</span></td>
                    <td><button className="del-btn" onClick={() => hospitalAPI.delete(h.id).then(reload)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'bloodbanks' && (
          <div className="admin-table-card card">
            <div className="card-title">Blood Bank Database</div>
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Address</th><th>A+</th><th>B+</th><th>O+</th><th>AB+</th><th>Action</th></tr>
              </thead>
              <tbody>
                {bloodBanks.map(bb => (
                  <tr key={bb.id}>
                    <td>{bb.name}</td>
                    <td>{bb.address}</td>
                    <td>{bb.a_pos}</td>
                    <td>{bb.b_pos}</td>
                    <td>{bb.o_pos}</td>
                    <td>{bb.ab_pos}</td>
                    <td><button className="del-btn" onClick={() => bloodBankAPI.delete(bb.id).then(reload)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}