import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/client';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form);
      login(res.data);
      window.location.href = res.data.role === 'admin' ? '/admin' : '/ambulance';
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand-block">
            <img src="/icon.jpeg" alt="Sanjeevani" className="login-brand-icon" />
            <div className="login-brand-text">
              <span className="login-brand-name">SANJEEVANI</span>
              <span className="login-brand-tagline">Every Second Matters</span>
            </div>
          </div>

          <div className="login-hero-text">
            <h1>Every second<br/>counts.</h1>
            <p>Intelligent emergency triage — connecting ambulances to the right hospital, faster.</p>
          </div>

          <div className="login-stats">
            <div className="login-stat">
              <span className="stat-num">60</span>
              <span className="stat-label">min golden hour</span>
            </div>
            <div className="login-stat-divider"/>
            <div className="login-stat">
              <span className="stat-num">3x</span>
              <span className="stat-label">faster routing</span>
            </div>
            <div className="login-stat-divider"/>
            <div className="login-stat">
              <span className="stat-num">AI</span>
              <span className="stat-label">triage engine</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your Sanjeevani account</p>
          </div>

          {error && (
            <div className="login-error">
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 5v3M8 10v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label>Email address</label>
              <div className="input-wrap">
                <svg viewBox="0 0 16 16" fill="none" width="15" height="15" className="input-icon">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1"/>
                  <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1"/>
                </svg>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="you@hospital.com"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Password</label>
              <div className="input-wrap">
                <svg viewBox="0 0 16 16" fill="none" width="15" height="15" className="input-icon">
                  <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1"/>
                </svg>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="btn-spinner"/>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="login-roles">
            <div className="role-pill role-admin">Admin</div>
            <div className="role-pill role-paramedic">Paramedic</div>
            <span className="role-hint">Two role-based interfaces</span>
          </div>
        </div>
      </div>
    </div>
  );
}
