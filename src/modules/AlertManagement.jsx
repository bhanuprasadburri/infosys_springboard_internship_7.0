import React, { useState, useEffect } from 'react'

const initialAlerts = [
  { id: 'DB-SRV-12', desc: 'CPU 94%', status: 'Critical' },
  { id: 'APP-SRV-47', desc: 'Disk 91%', status: 'Investigating' },
]

export default function AlertManagement() {
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('alerts')
    return saved ? JSON.parse(saved) : initialAlerts
  })

  useEffect(() => {
    localStorage.setItem('alerts', JSON.stringify(alerts))
  }, [alerts])

  const clear = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id))

  return (
    <section>
      <h2>Alert Management</h2>
      <div style={{ marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <th>ID</th>
              <th>Description</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.desc}</td>
                <td>{a.status}</td>
                <td><button onClick={() => clear(a.id)}>Acknowledge</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
