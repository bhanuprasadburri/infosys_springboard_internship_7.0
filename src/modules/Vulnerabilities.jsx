import React from 'react'

export default function Vulnerabilities() {
  const vulnerabilities = [
    { id: 'VUL-2001', description: 'Outdated OpenSSL version', severity: 'High' },
    { id: 'VUL-2002', description: 'Cross-site scripting risk', severity: 'Medium' },
    { id: 'VUL-2003', description: 'Unpatched container image', severity: 'Critical' },
  ]

  return (
    <section>
      <h2>Vulnerabilities</h2>
      <div style={{ marginTop: 16 }}>
        {vulnerabilities.map((item) => (
          <div key={item.id} className="metric-card" style={{ marginBottom: 12 }}>
            <div className="metric-title">{item.id}</div>
            <div className="metric-value">{item.description}</div>
            <div className="metric-sub">Severity: {item.severity}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
