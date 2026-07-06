import React, { useEffect, useState } from 'react'
import { computeOverview, computeResourceAverages } from './MonitoringEngine'

export default function HealthDashboard() {
  const [summary, setSummary] = useState({ total: 0, healthy: 0, critical: 0, uptime: '99.99%' })
  const [resources, setResources] = useState({ cpu: 0, memory: 0, disk: 0 })
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const read = () => {
      const assets = JSON.parse(localStorage.getItem('assets') || '[]')
      const mon = JSON.parse(localStorage.getItem('monitoring_summary') || 'null')
      const al = JSON.parse(localStorage.getItem('alerts') || '[]')
      if (mon) {
        setResources({ cpu: mon.cpu, memory: mon.memory, disk: mon.disk })
      } else {
        setResources(computeResourceAverages(assets))
      }
      setSummary(computeOverview(assets))
      setAlerts(al)
    }
    read()
    const t = setInterval(read, 3000)
    return () => clearInterval(t)
  }, [])

  const percent = (v) => `${v}%`

  return (
    <section>
      <h2>Health Dashboard</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <div className="metric-card">
          <div className="metric-title">Total Assets</div>
          <div className="metric-value">{summary.total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Healthy Assets</div>
          <div className="metric-value">{summary.healthy}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Critical Assets</div>
          <div className="metric-value">{summary.critical}</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Avg CPU</div>
          <div className="metric-value">{resources.cpu}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Avg Memory</div>
          <div className="metric-value">{resources.memory}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Active Alerts</div>
          <div className="metric-value">{alerts.length}</div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8 }}>CPU Usage</div>
        <div style={{ background: 'rgba(255,255,255,0.03)', height: 12, borderRadius: 8 }}>
          <div style={{ width: percent(resources.cpu), background: '#1f6feb', height: 12, borderRadius: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>Memory Usage</div>
        <div style={{ background: 'rgba(255,255,255,0.03)', height: 12, borderRadius: 8 }}>
          <div style={{ width: percent(resources.memory), background: '#2dbf6e', height: 12, borderRadius: 8 }} />
        </div>
        <div style={{ marginTop: 8 }}>Disk Usage</div>
        <div style={{ background: 'rgba(255,255,255,0.03)', height: 12, borderRadius: 8 }}>
          <div style={{ width: percent(resources.disk), background: '#f5a623', height: 12, borderRadius: 8 }} />
        </div>
      </div>
    </section>
  )
}
