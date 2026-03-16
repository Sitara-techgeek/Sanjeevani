import React, { useState } from 'react';
import { uploadAPI } from '../api/client';
import './AdminFileUpload.css';

export default function AdminFileUpload({ onSuccess }) {
  const [hospFile, setHospFile]   = useState(null);
  const [bbFile, setBbFile]       = useState(null);
  const [status, setStatus]       = useState({});
  const [loading, setLoading]     = useState({});

  const upload = async (type) => {
    const file = type === 'hospital' ? hospFile : bbFile;
    if (!file) return;
    setLoading(l => ({...l, [type]: true}));
    setStatus(s => ({...s, [type]: null}));
    try {
      const fn = type === 'hospital' ? uploadAPI.hospitals : uploadAPI.bloodBanks;
      const res = await fn(file);
      setStatus(s => ({...s, [type]: { ok: true, msg: res.data.message }}));
      onSuccess();
    } catch (err) {
      setStatus(s => ({...s, [type]: { ok: false, msg: err.response?.data?.detail || 'Upload failed' }}));
    } finally {
      setLoading(l => ({...l, [type]: false}));
    }
  };

  return (
    <div className="upload-grid">
      {[
        { key: 'hospital',   label: 'Upload Hospital Data',   file: hospFile, setFile: setHospFile },
        { key: 'blood_bank', label: 'Upload Blood Bank Data', file: bbFile,   setFile: setBbFile   },
      ].map(({ key, label, file, setFile }) => (
        <div key={key} className="upload-card card">
          <div className="card-title">{label}</div>
          <p className="upload-hint">Upload a .txt, .csv, or any text file. AI will parse it automatically into the database.</p>
          <div className="upload-drop" onClick={() => document.getElementById(`file-${key}`).click()}>
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32" style={{opacity:0.4, margin:'0 auto 8px', display:'block'}}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="upload-drop-text">{file ? file.name : 'Click to select file'}</div>
            <input id={`file-${key}`} type="file" accept=".txt,.csv,.json,.pdf" style={{display:'none'}}
              onChange={e => setFile(e.target.files[0])} />
          </div>
          <button className="upload-btn" onClick={() => upload(key === 'blood_bank' ? 'blood_bank' : 'hospital')} disabled={!file || loading[key]}>
            {loading[key] ? 'AI Processing...' : 'Upload & Parse with AI'}
          </button>
          {status[key] && (
            <div className={`upload-status ${status[key].ok ? 'upload-ok' : 'upload-err'}`}>
              {status[key].msg}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}