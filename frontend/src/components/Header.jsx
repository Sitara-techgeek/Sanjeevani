import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header({ role }) {
  const { user, logout } = useAuth();
  const [time, setTime]  = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const roleLabel = role === 'admin' ? 'Admin' : 'Paramedic';
  const roleColor = role === 'admin' ? 'header-role-admin' : 'header-role-paramedic';

  return (
    <header className="header">
      <div className="header-brand">
        <img src="/icon.jpeg" alt="Sanjeevani" className="header-logo-img" />
        <div className="header-brand-text">
          <span className="header-title">Sanjeevani</span>
          <span className="header-tagline">Every Second Matters</span>
        </div>
        <span className={`header-role-badge ${roleColor}`}>{roleLabel}</span>
      </div>

      <div className="header-center">
        <div className="header-pulse">
          <span className="pulse-ring"/>
          <span className="pulse-dot"/>
        </div>
        <span className="header-status-text">System Active</span>
      </div>

      <div className="header-right">
        <div className="header-time">
          {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="header-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className="user-name">{user?.name || 'User'}</span>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Sign out">
          <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M10 11l3-3-3-3M13 8H6"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}