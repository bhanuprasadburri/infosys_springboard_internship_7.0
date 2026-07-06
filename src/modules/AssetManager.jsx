import React, { useState, useEffect } from 'react'

const initialAssets = [
  { id: 'AS-1001', name: 'DB-SRV-12', type: 'Database', ip: '10.0.0.12', status: 'Healthy', owner: 'DB Team', location: 'us-east-1' },
  { id: 'AS-1002', name: 'APP-SRV-47', type: 'Application', ip: '10.0.0.47', status: 'Warning', owner: 'App Team', location: 'us-east-1' },
]

const statusTone = {
  Healthy: 'status-good',
  Warning: 'status-warn',
  Critical: 'status-critical',
}

export default function AssetManager({ onMetricsUpdate }) {
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('assets')
    return saved ? JSON.parse(saved) : initialAssets
  })
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', type: '', ip: '', status: 'Healthy', owner: '', location: '' })

  useEffect(() => {
    localStorage.setItem('assets', JSON.stringify(assets))
    if (onMetricsUpdate) onMetricsUpdate(assets)
  }, [assets])

  const startAdd = () => { setEditing('new'); setForm({ id: `AS-${Date.now()}`, name: '', type: '', ip: '', status: 'Healthy', owner: '', location: '' }) }
  const startEdit = (a) => { setEditing(a.id); setForm(a) }
  const save = () => {
    setAssets((prev) => {
      const exists = prev.find((p) => p.id === form.id)
      if (exists) return prev.map((p) => (p.id === form.id ? form : p))
      return [form, ...prev]
    })
    setEditing(null)
  }
  const remove = (id) => setAssets((prev) => prev.filter((p) => p.id !== id))

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h3 style={{ marginBottom: 4 }}>Asset inventory</h3>
          <div className="metric-sub">Track ownership, connectivity, and health posture.</div>
        </div>
        <button onClick={startAdd}>Add Asset</button>
      </div>

      {editing && (
        <div className="asset-form" style={{ marginBottom: 14 }}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
          <input placeholder="IP" value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} />
          <input placeholder="Owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option>Healthy</option>
            <option>Warning</option>
            <option>Critical</option>
          </select>
          <div className="asset-actions-row">
            <button onClick={save}>Save</button>
            <button onClick={() => setEditing(null)} style={{ background: 'rgba(255,255,255,0.08)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-shell">
        <table>
          <thead>
            <tr>
              <th>Asset ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>IP</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.type}</td>
                <td>{a.ip}</td>
                <td><span className={`status-pill small ${statusTone[a.status] || ''}`}>{a.status}</span></td>
                <td>{a.owner}</td>
                <td>{a.location}</td>
                <td>
                  <div className="asset-actions-row">
                    <button onClick={() => startEdit(a)} style={{ padding: '8px 10px' }}>Edit</button>
                    <button onClick={() => remove(a.id)} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.08)' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
