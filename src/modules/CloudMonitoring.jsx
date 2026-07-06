import React, { useEffect, useState } from 'react'

export default function CloudMonitoring() {
  const [instances, setInstances] = useState(() => {
    const v = localStorage.getItem('cloud_instances')
    return v ? Number(v) : 5
  })

  useEffect(() => {
    localStorage.setItem('cloud_instances', String(instances))
  }, [instances])

  useEffect(() => {
    const t = setInterval(() => {
      const mon = JSON.parse(localStorage.getItem('monitoring_summary') || 'null')
      if (!mon) return
      // autoscale: if CPU avg > 75% add one instance, if < 30% remove one
      if (mon.cpu > 75) setInstances((s) => s + 1)
      else if (mon.cpu < 30 && instances > 1) setInstances((s) => Math.max(1, s - 1))
    }, 4000)
    return () => clearInterval(t)
  }, [instances])

  return (
    <section>
      <h2>Cloud Monitoring</h2>
      <div style={{ marginTop: 12 }}>
        <p>Cloud instance status and autoscaling simulation.</p>
        <p>Instances: {instances}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setInstances((s) => s + 1)}>Scale Up</button>
          <button onClick={() => setInstances((s) => Math.max(1, s - 1))}>Scale Down</button>
        </div>
      </div>
    </section>
  )
}
