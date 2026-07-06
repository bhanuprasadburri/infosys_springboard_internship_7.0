import React from 'react'

export default function HealthChecks() {
  return (
    <section>
      <h2>Health Checks</h2>
      <div style={{ marginTop: 12 }}>
        <p>Automated health checks and scheduled probes.</p>
        <ul>
          <li>DB connectivity: OK</li>
          <li>Disk space checks: Warning on APP-SRV-47</li>
          <li>Certificate expiry: 12 days</li>
        </ul>
      </div>
    </section>
  )
}
