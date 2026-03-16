import React from 'react';
import './StatusFeed.css';

export default function StatusFeed({ notifications }) {
  return (
    <div className="feed-card card">
      <div className="card-title">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1"/>
          <path d="M8 5v3l2 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        Emergency Status Feed
      </div>
      {notifications.length === 0 ? (
        <div className="feed-empty">No events yet. Run triage to begin.</div>
      ) : (
        notifications.map((n, i) => (
          <div key={i} className={`feed-item feed-${n.type}`}>
            <span className="feed-icon">{n.icon}</span>
            <span className="feed-text">{n.text}</span>
          </div>
        ))
      )}
    </div>
  );
}