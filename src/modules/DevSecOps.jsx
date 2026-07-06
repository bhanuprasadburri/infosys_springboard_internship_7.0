import React from 'react'

export default function DevSecOps() {
  const pipelines = [
    { name: 'CI Pipeline', status: 'Passing' },
    { name: 'Security Scan', status: 'Failing' },
    { name: 'Deployment', status: 'Staged' },
  ]

  return (
    <section>
      <h2>DevSecOps</h2>
      <div style={{ marginTop: 16 }}>
        {pipelines.map((item) => (
          <div key={item.name} className="metric-card" style={{ marginBottom: 12 }}>
            <div className="metric-title">{item.name}</div>
            <div className="metric-sub">Status: {item.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
