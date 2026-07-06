import React, { useState } from 'react'
import AssetManager from './AssetManager'
import AlertManagement from './AlertManagement'

export default function AssetService() {
  const [metrics, setMetrics] = useState({ total: 2_847, healthy: 2_835, critical: 12 })

  return (
    <section>
      <div className="asset-service hero-panel" style={{ marginBottom: 20 }}>
        <div>
          <div className="hero-kicker">Asset Service</div>
          <h2 style={{ marginBottom: 8 }}>Infrastructure inventory and operational health</h2>
          <p className="hero-copy">
            Monitor critical systems, manage ownership, and track service health from one controlled console.
          </p>
        </div>
        <div className="hero-actions">
          <span className="status-badge">Live inventory</span>
          <span className="status-badge alt">SLA aligned</span>
        </div>
      </div>

      <div className="overview-grid" style={{ marginBottom: 20 }}>
        <div className="metric-card">
          <div className="metric-title">Total Assets</div>
          <div className="metric-value">{metrics.total}</div>
          <div className="metric-sub">Managed endpoints and services</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Healthy</div>
          <div className="metric-value">{metrics.healthy}</div>
          <div className="metric-sub">Operating within expected thresholds</div>
        </div>
        <div className="metric-card">
          <div className="metric-title">Critical</div>
          <div className="metric-value">{metrics.critical}</div>
          <div className="metric-sub">Priority attention required</div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-panel asset-service">
          <AssetManager
            onMetricsUpdate={(assets) =>
              setMetrics({
                total: assets.length,
                healthy: assets.filter((a) => a.status === 'Healthy').length,
                critical: assets.filter((a) => a.status === 'Critical').length,
              })
            }
          />
        </div>

        <aside className="overview-panel asset-service">
          <AlertManagement />
        </aside>
      </div>
    </section>
  )
}
