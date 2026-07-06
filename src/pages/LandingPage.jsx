import React from 'react'
import './auth.css'

export default function LandingPage({ setMode }) {
  return (
    <div className="auth-shell landing-shell">
      <div className="landing-card">
        <div className="landing-panel">
          <div>
            <div className="eyebrow">SentinelCore SecureOps</div>
            <h1>Complete visibility for your security operations.</h1>
            <p className="landing-copy">
              SentinelCore unifies monitoring, vulnerability management, incident response, and compliance into a modern operations center built for hybrid infrastructure.
            </p>
          </div>

          <div className="landing-actions">
            <button type="button" onClick={() => setMode('login')}>
              Login
            </button>
            <button type="button" className="secondary" onClick={() => setMode('signup')}>
              Sign Up
            </button>
          </div>
        </div>

        <div className="landing-highlights">
          <div className="highlight-card">
            <h3>Unified dashboard</h3>
            <p>Correlate alerts, assets, and compliance status from one secure command center.</p>
          </div>
          <div className="highlight-card">
            <h3>Live monitoring</h3>
            <p>See auto-scaled cloud health, network metrics, and infrastructure status in real time.</p>
          </div>
          <div className="highlight-card">
            <h3>Risk intelligence</h3>
            <p>Track vulnerabilities, audit findings, and DevSecOps pipeline status with clarity.</p>
          </div>
          <div className="highlight-card">
            <h3>Compliance readiness</h3>
            <p>Audit controls, standards posture, and reporting in a single workflow.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
