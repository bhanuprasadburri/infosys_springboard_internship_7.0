import React from 'react'

export default function NetworkMonitoring() {
  return (
    <section>
      <h2>Network Monitoring</h2>
      <div style={{ marginTop: 12 }}>
        <p>Traffic, latency and packet loss metrics.</p>
        <ul>
          <li>Avg Latency: 12ms</li>
          <li>Packet loss: 0.02%</li>
          <li>Throughput: 1.2Gbps</li>
        </ul>
      </div>
    </section>
  )
}
