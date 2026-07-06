import React from 'react'

export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-app">SentinelCore SecureOps</div>
        {user && <div className="topbar-sub">{user.name} • {user.role}</div>}
      </div>
      <div className="topbar-right">
        {user ? (
          <div className="topbar-actions">
            <span className="status-pill">Live Telemetry</span>
            {onLogout && (
              <button className="logout-button" onClick={onLogout}>
                Logout
              </button>
            )}
          </div>
        ) : (
          <span className="status-pill">Security Portal</span>
        )}
      </div>
    </header>
  )
}
