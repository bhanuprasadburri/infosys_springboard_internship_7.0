import type { Asset, Alert, AuditLog, ComplianceReport, Incident, Metric, Policy, Report, Vulnerability, VulnerabilityStatus, AlertSeverity } from '../types';

export const mockAssets: Asset[] = [
  { id: 'AS-1001', name: 'DB-SRV-12', type: 'server', environment: 'Production', status: 'critical', cpu: 94, memory: 81, disk: 67, network: 32, allocatedCapacity: 24, lastChecked: '2m ago', provider: 'AWS' },
  { id: 'AS-1002', name: 'APP-SRV-03', type: 'server', environment: 'Production', status: 'healthy', cpu: 21, memory: 44, disk: 58, network: 11, allocatedCapacity: 18, lastChecked: '1m ago', provider: 'Azure' },
  { id: 'AS-1003', name: 'WEB-SRV-08', type: 'server', environment: 'Staging', status: 'warning', cpu: 68, memory: 73, disk: 51, network: 23, allocatedCapacity: 20, lastChecked: '5m ago', provider: 'AWS' },
  { id: 'AS-1004', name: 'CACHE-CLD-01', type: 'cloud', environment: 'Production', status: 'healthy', cpu: 19, memory: 37, disk: 44, network: 8, allocatedCapacity: 16, lastChecked: '3m ago', provider: 'AWS' },
  { id: 'AS-1005', name: 'K8S-POD-44', type: 'k8s-pod', environment: 'Production', status: 'warning', cpu: 57, memory: 64, disk: 42, network: 18, allocatedCapacity: 12, lastChecked: '7m ago', provider: 'Kubernetes' },
  { id: 'AS-1006', name: 'API-SRV-11', type: 'server', environment: 'Production', status: 'healthy', cpu: 13, memory: 31, disk: 39, network: 9, allocatedCapacity: 14, lastChecked: '4m ago', provider: 'Azure' },
];

export const mockAlerts: Alert[] = [
  { id: 'ALT-001', message: 'DB-SRV-12 CPU 94% | Auto-scaled | Resolved', severity: 'critical', source: 'CPU Monitor', status: 'resolved', timestamp: '2m ago', action: 'Scale' },
  { id: 'ALT-002', message: 'K8S-POD-77 Memory spike detected', severity: 'high', source: 'Kubernetes', status: 'active', timestamp: '6m ago', action: 'Investigate' },
  { id: 'ALT-003', message: 'WEB-SRV-08 Latency above threshold', severity: 'medium', source: 'Network Monitor', status: 'active', timestamp: '12m ago', action: 'View Assets' },
];

export const mockMetrics: Metric[] = [
  { label: 'CPU', value: 23, unit: '%', threshold: 80, status: 'healthy' },
  { label: 'Memory', value: 47, unit: '%', threshold: 75, status: 'healthy' },
  { label: 'Disk', value: 67, unit: '%', threshold: 85, status: 'warning' },
  { label: 'Network', value: 12, unit: '%', threshold: 60, status: 'healthy' },
];

const incidentSeeds: Incident[] = [
  { id: 'INC-2024-1247', title: 'Failed Login Attempts', severity: 'critical', sourceIp: '203.0.113.10', status: 'Open', assignedTeam: 'Security Team', assignee: 'Ava Chen', eta: '12 min', createdAt: '08:40 UTC', source: 'IP 203.0.113.10', type: 'Authentication', affectedAsset: 'Identity Gateway', affectedUser: 'm.lee@acme.dev', slaHours: 2, activityLog: ['Opened by SOC automation'], recommendedActions: ['Block IP', 'Reset password', 'Notify user'], notes: [] },
  { id: 'INC-2024-1248', title: 'Latency Spike', severity: 'high', sourceIp: '198.51.100.5', status: 'Assigned', assignedTeam: 'Network Team', assignee: 'Daniel Kim', eta: '25 min', createdAt: '08:12 UTC', source: 'IP 198.51.100.5', type: 'Network', affectedAsset: 'Edge Gateway', affectedUser: 'ops@acme.dev', slaHours: 4, activityLog: ['Assigned to Network Team'], recommendedActions: ['Block IP', 'Notify user', 'Review routing'], notes: [] },
  { id: 'INC-2024-1249', title: 'Token Replay Alert', severity: 'medium', sourceIp: '192.0.2.77', status: 'Investigation', assignedTeam: 'Compliance Team', assignee: 'Mina Patel', eta: '40 min', createdAt: '07:44 UTC', source: 'IP 192.0.2.77', type: 'Identity', affectedAsset: 'Authentication API', affectedUser: 's.nguyen@acme.dev', slaHours: 8, activityLog: ['Escalated for identity review'], recommendedActions: ['Block IP', 'Reset password', 'Notify user'], notes: [] },
];

export const mockIncidents: Incident[] = Array.from({ length: 23 }, (_, index) => {
  const seed = incidentSeeds[index % incidentSeeds.length];
  return {
    ...seed,
    id: `INC-2024-${1250 + index}`,
    title: `${seed.title} ${index + 1}`,
    severity: index % 4 === 0 ? 'critical' : index % 3 === 0 ? 'high' : index % 2 === 0 ? 'medium' : 'low',
    status: index < 8 ? 'Open' : index < 15 ? 'Assigned' : index < 20 ? 'Investigation' : 'Open',
    assignedTeam: index % 2 === 0 ? 'Security Team' : index % 3 === 0 ? 'Network Team' : 'DevSecOps Team',
    assignee: index % 2 === 0 ? 'Ava Chen' : 'Daniel Kim',
    eta: `${Math.max(12, (index + 1) * 3)} min`,
    slaHours: Math.max(1, Math.min(8, 2 + (index % 4))),
    activityLog: [seed.activityLog?.[0] ?? 'Created by SOC automation'],
    recommendedActions: seed.recommendedActions,
    notes: [],
  };
});

const vulnSeeds = [
  { cveId: 'CVE-2024-2382', severity: 'critical' as AlertSeverity, cvss: 9.8, source: 'Trivy', assets: ['DB-SRV-12', 'WEB-SRV-08', 'API-SRV-11'] },
  { cveId: 'CVE-2024-2143', severity: 'high' as AlertSeverity, cvss: 8.7, source: 'SonarQube', assets: ['APP-SRV-03', 'CACHE-CLD-01'] },
  { cveId: 'CVE-2023-5038', severity: 'medium' as AlertSeverity, cvss: 6.1, source: 'Trivy', assets: ['K8S-POD-44'] },
  { cveId: 'CVE-2024-3847', severity: 'critical' as AlertSeverity, cvss: 9.5, source: 'OpenVAS', assets: ['API-SRV-11', 'K8S-POD-44'] },
  { cveId: 'CVE-2024-4102', severity: 'high' as AlertSeverity, cvss: 8.2, source: 'Nessus', assets: ['WEB-SRV-08', 'CACHE-CLD-01'] },
  { cveId: 'CVE-2024-5012', severity: 'medium' as AlertSeverity, cvss: 7.1, source: 'Trivy', assets: ['DB-SRV-12'] },
  { cveId: 'CVE-2024-5567', severity: 'low' as AlertSeverity, cvss: 4.3, source: 'SonarQube', assets: ['APP-SRV-03'] },
  { cveId: 'CVE-2024-6234', severity: 'critical' as AlertSeverity, cvss: 9.9, source: 'OpenVAS', assets: ['K8S-POD-44', 'API-SRV-11', 'WEB-SRV-08'] },
  { cveId: 'CVE-2024-6891', severity: 'high' as AlertSeverity, cvss: 8.5, source: 'Nessus', assets: ['DB-SRV-12', 'CACHE-CLD-01'] },
  { cveId: 'CVE-2024-7341', severity: 'medium' as AlertSeverity, cvss: 6.8, source: 'Trivy', assets: ['APP-SRV-03', 'WEB-SRV-08'] },
];

export const mockVulnerabilities: Vulnerability[] = Array.from({ length: 20 }, (_, index) => {
  const seed = vulnSeeds[index % vulnSeeds.length];
  const statuses: VulnerabilityStatus[] = ['available', 'tested', 'pending', 'patched'];
  const status = statuses[index % 4];
  const baseRisk = seed.severity === 'critical' ? 90 : seed.severity === 'high' ? 70 : seed.severity === 'medium' ? 50 : 30;
  const riskScore = Math.max(1, baseRisk - (status === 'patched' ? 40 : status === 'tested' ? 15 : 0));
  return {
    id: `VUL-${String(index + 1).padStart(3, '0')}`,
    cveId: `${seed.cveId.split('-')[0]}-${seed.cveId.split('-')[1]}-${2024 + Math.floor(index / 10)}`,
    severity: seed.severity,
    cvss: Math.round((seed.cvss + (index * 0.1) % 0.5) * 10) / 10,
    affectedAssets: Math.max(1, seed.assets.length + (index % 3)),
    patchStatus: status,
    riskScore,
    previousRiskScore: status === 'patched' ? riskScore + 40 : riskScore,
    lastScanSource: seed.source,
    lastScanTimestamp: `2026-07-${String(Math.max(1, 21 - index)).padStart(2, '0')} ${String(8 + (index % 8)).padStart(2, '0')}:${String(32 - (index % 60)).padStart(2, '0')}`,
    affectedAssetNames: seed.assets,
    activityLog: status === 'patched' ? ['Patched successfully', `Risk reduced from ${riskScore + 40} to ${riskScore}`] : [],
  };
});

export const mockAuditLogs: AuditLog[] = [
  { id: 'LOG-001', action: 'Login Granted', user: 'Ava Chen', timestamp: '2026-07-11 09:12', date: '2026-07-11', source: '10.10.1.21' },
  { id: 'LOG-002', action: 'Policy Updated', user: 'Daniel Kim', timestamp: '2026-07-11 08:49', date: '2026-07-11', source: '10.10.1.42' },
  { id: 'LOG-003', action: 'Export Report', user: 'Mina Patel', timestamp: '2026-07-11 08:07', date: '2026-07-11', source: '10.10.1.33' },
];

export const mockComplianceReports: ComplianceReport[] = [
  { framework: 'PCI DSS', status: 'Compliant' },
  { framework: 'SOC 2', status: 'Compliant' },
  { framework: 'ISO 27001', status: 'Compliant' },
];

export const mockPolicies: Policy[] = [
  { id: 'POL-001', name: 'MFA Enforcement', owner: 'IAM', status: 'Enabled' },
  { id: 'POL-002', name: 'Quarterly Access Review', owner: 'Compliance', status: 'Review' },
];

export const mockReports: Report[] = [
  { id: 'RPT-001', name: 'Access Report', type: 'PDF', generatedAt: '2026-07-11' },
  { id: 'RPT-002', name: 'Security Report', type: 'CSV', generatedAt: '2026-07-11' },
];
