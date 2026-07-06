import React from 'react'

export default function Incidents() {
  const incidents = [
    { id: 'INC-1001', title: 'Database latency spike', status: 'Investigating' },
    { id: 'INC-1002', title: 'API rate limit exceeded', status: 'Resolved' },
    { id: 'INC-1003', title: 'Unauthorized login attempt', status: 'Open' },
  ]

  return (
    <section>
      <h2>Incidents</h2>
      <div style={{ marginTop: 16 }}>
        {incidents.map((incident) => (
          <div key={incident.id} className="metric-card" style={{ marginBottom: 12 }}>
            <div className="metric-title">{incident.id}</div>
            <div className="metric-value">{incident.title}</div>
            <div className="metric-sub">Status: {incident.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
