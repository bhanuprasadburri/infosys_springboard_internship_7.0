import React from 'react'

const modules = [
  'Dashboard',
  'Health Dashboard',
  'Asset Service',
  'Infrastructure Monitoring',
  'Cloud Monitoring',
  'Network Monitoring',
  'Health Checks',
  'Alert Management',
  'Incidents',
  'Vulnerabilities',
  'Audit',
  'Compliance',
  'DevSecOps',
]

export default function Sidebar({ selected, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">SentinelCore</div>
      <div className="sidebar-subtitle">Enterprise Security Console</div>
      <ul className="sidebar-nav">
        {modules.map((m) => (
          <li
            key={m}
            role="button"
            tabIndex={0}
            onClick={() => onSelect && onSelect(m)}
            onKeyDown={(e) => (e.key === 'Enter' && onSelect && onSelect(m))}
            className={m === selected ? 'active' : ''}
          >
            {m}
          </li>
        ))}
      </ul>
    </aside>
  )
}
