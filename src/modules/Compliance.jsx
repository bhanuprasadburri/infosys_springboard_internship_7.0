import React from 'react'

export default function Compliance() {
  const complianceItems = [
    { standard: 'PCI DSS', status: ' compliant' },
    { standard: 'ISO 27001', status: 'Non-compliant' },
    { standard: 'SOC 2', status: 'Review required' },
  ]

  return (
    <section>
      <h2>Compliance</h2>
      <div style={{ marginTop: 16 }}>
        {complianceItems.map((item) => (
          <div key={item.standard} className="metric-card" style={{ marginBottom: 12 }}>
            <div className="metric-title">{item.standard}</div>
            <div className="metric-sub">Status: {item.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
