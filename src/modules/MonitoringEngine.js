// Simple monitoring engine to simulate metrics and generate alerts
export function evaluateMetrics(assets) {
  // returns generated alerts based on fake randomized resource usage
  const alerts = []
  assets.forEach((a) => {
    const cpu = Math.floor(Math.random() * 100)
    const mem = Math.floor(Math.random() * 100)
    const disk = Math.floor(Math.random() * 100)
    if (cpu > 90) alerts.push({ id: a.name || a.id, desc: `CPU ${cpu}%`, status: 'Critical' })
    if (mem > 95) alerts.push({ id: a.name || a.id, desc: `Memory ${mem}%`, status: 'Critical' })
    if (disk > 95) alerts.push({ id: a.name || a.id, desc: `Disk ${disk}%`, status: 'Critical' })
  })
  return alerts
}

export function computeOverview(assets) {
  const total = assets.length
  const healthy = assets.filter(a => a.status === 'Healthy').length
  const critical = assets.filter(a => a.status === 'Critical').length
  return { total, healthy, critical, uptime: '99.99%' }
}

export function computeResourceAverages(assets) {
  // Simulate per-asset resource readings and return averages
  if (!assets || assets.length === 0) return { cpu: 0, memory: 0, disk: 0 }
  let cpuSum = 0, memSum = 0, diskSum = 0
  assets.forEach(() => {
    cpuSum += Math.floor(Math.random() * 80) + 10 // 10-89
    memSum += Math.floor(Math.random() * 70) + 15 // 15-84
    diskSum += Math.floor(Math.random() * 70) + 5 // 5-74
  })
  const n = assets.length
  return {
    cpu: Math.round(cpuSum / n),
    memory: Math.round(memSum / n),
    disk: Math.round(diskSum / n),
  }
}

export function mergeAlerts(existing = [], incoming = []) {
  const map = new Map()
  existing.forEach(a => map.set(a.id + '|' + a.desc, a))
  incoming.forEach(a => map.set(a.id + '|' + a.desc, a))
  return Array.from(map.values())
}
