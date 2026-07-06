import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import MetricCard from '../components/MetricCard'
import AssetService from '../modules/AssetService'
import InfrastructureMonitoring from '../modules/InfrastructureMonitoring'
import CloudMonitoring from '../modules/CloudMonitoring'
import NetworkMonitoring from '../modules/NetworkMonitoring'
import HealthChecks  from '../modules/HealthChecks'
import AlertManagement from '../modules/AlertManagement'
import HealthDashboard from '../modules/HealthDashboard'
import Incidents from '../modules/Incidents'
import Vulnerabilities from '../modules/Vulnerabilities'
import Audit from '../modules/Audit'
import Compliance from '../modules/Compliance'
import DevSecOps from '../modules/DevSecOps'
import { evaluateMetrics, computeResourceAverages, mergeAlerts } from '../modules/MonitoringEngine'
import './dashboard.css'

const sample = {
  assetsMonitored: 2847,
  uptime: '99.99% ',
  alerts: 12,
}

export default function Dashboard({ user, onLogout }) {
  const [selected, setSelected] = useState('Dashboard')

  const renderContent = () => {
    switch (selected) {
      case 'Health Dashboard':
        return <HealthDashboard />
      case 'Asset Service':
        return <AssetService />
      case 'Infrastructure Monitoring':
        return <InfrastructureMonitoring />
      case 'Cloud Monitoring':
        return <CloudMonitoring />
      case 'Network Monitoring':
        return <NetworkMonitoring />
      case 'Health Checks':
        return <HealthChecks />
      case 'Alert Management':
        return <AlertManagement />
      case 'Incidents':
        return <Incidents />
      case 'Vulnerabilities':
        return <Vulnerabilities />
      case 'Audit':
        return <Audit />
      case 'Compliance':
        return <Compliance />
      case 'DevSecOps':
        return <DevSecOps />
      default:
        return (
          <>
            <section className="hero-panel">
              <div>
                <div className="hero-kicker">SecureOps Command Center</div>
                <h1 className="page-title">Enterprise visibility across cloud, network, and infrastructure.</h1>
                <p className="hero-copy">
                  Track health, manage incidents, and keep compliance posture aligned with real-time operational insight.
                </p>
              </div>
              <div className="hero-actions">
                <span className="status-badge">99.99% SLA</span>
                <span className="status-badge alt">8 active incidents</span>
                <span className="status-badge alt">SOC 2 review ready</span>
              </div>
            </section>

            <div className="metrics-row">
              <MetricCard
                title="Assets Monitored"
                value={sample.assetsMonitored}
                subtitle="Servers + Cloud"
              />
              <MetricCard title="Uptime" value={sample.uptime} subtitle="SLA target" />
              <MetricCard title="Alerts" value={sample.alerts} subtitle="Priority queue" />
            </div>

            <div className="overview-grid">
              <section className="asset-service overview-panel">
                <h2>Current posture</h2>
                <div className="asset-body">
                  <p>
                    <strong>Runtime:</strong> 2,847 monitored assets with 99.99% service availability.
                  </p>
                  <p>
                    <strong>Infrastructure:</strong> 1,247 servers, 47 clusters, and 847 cloud workloads remain healthy.
                  </p>
                  <p>
                    <strong>Response readiness:</strong> Threat triage and remediation workflows are operating within SLA.
                  </p>
                </div>
              </section>

              <section className="asset-service overview-panel">
                <h2>Response queue</h2>
                <div className="queue-list">
                  <div className="queue-item">
                    <div>
                      <strong>DB-SRV-12</strong>
                      <div className="queue-meta">CPU spike • Investigating</div>
                    </div>
                    <span className="status-badge">High</span>
                  </div>
                  <div className="queue-item">
                    <div>
                      <strong>APP-SRV-47</strong>
                      <div className="queue-meta">Disk pressure • Contained</div>
                    </div>
                    <span className="status-badge alt">Medium</span>
                  </div>
                  <div className="queue-item">
                    <div>
                      <strong>IAM review</strong>
                      <div className="queue-meta">Access drift • Scheduled</div>
                    </div>
                    <span className="status-badge alt">Planned</span>
                  </div>
                </div>
              </section>
            </div>
          </>
        )
    }
  }

  // monitoring loop: evaluate metrics, persist summary and alerts, autoscale cloud
  React.useEffect(() => {
    const tick = () => {
      const assets = JSON.parse(localStorage.getItem('assets') || '[]')
      const alertsExisting = JSON.parse(localStorage.getItem('alerts') || '[]')
      const newAlerts = evaluateMetrics(assets)
      const merged = mergeAlerts(alertsExisting, newAlerts)
      localStorage.setItem('alerts', JSON.stringify(merged))
      const averages = computeResourceAverages(assets)
      const overview = { ...averages }
      localStorage.setItem('monitoring_summary', JSON.stringify(overview))
      // cloud autoscaling signal: managed in CloudMonitoring which reads monitoring_summary
    }
    tick()
    const t = setInterval(tick, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="app-root">
      <Header user={user} onLogout={onLogout} />
      <div className="app-body">
        <Sidebar selected={selected} onSelect={setSelected} />
        <main className="main-area">{renderContent()}</main>
      </div>
    </div>
  )
}
