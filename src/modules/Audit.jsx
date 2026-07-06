import React from 'react'

export default function Audit() {
  const auditItems = [
    { step: 'Login events', status: 'Complete' },
    { step: 'Config drift scan', status: 'Pending' },
    { step: 'Access review', status: 'Complete' },
  ]

  return (
    <section>
      <h2>Audit</h2>
      <div style={{ marginTop: 16 }}>
        {auditItems.map((item, index) => (
          <div key={index} className="metric-card" style={{ marginBottom: 12 }}>
            <div className="metric-title">{item.step}</div>
            <div className="metric-sub">Status: {item.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
