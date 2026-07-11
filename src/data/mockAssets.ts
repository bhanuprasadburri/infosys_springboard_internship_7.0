import type { Asset, Alert, AuditLog, ComplianceReport, Incident, Metric, Policy, Report, Vulnerability } from '../types';

export const mockAssets: Asset[] = [
  { id: 'AS-1001', name: 'DB-SRV-12', type: 'server', environment: 'Production', status: 'critical', cpu: 94, memory: 81, disk: 67, network: 32, lastChecked: '2m ago', provider: 'AWS' },
  { id: 'AS-1002', name: 'APP-SRV-03', type: 'server', environment: 'Production', status: 'healthy', cpu: 21, memory: 44, disk: 58, network: 11, lastChecked: '1m ago', provider: 'Azure' },
  { id: 'AS-1003', name: 'WEB-SRV-08', type: 'server', environment: 'Staging', status: 'warning', cpu: 68, memory: 73, disk: 51, network: 23, lastChecked: '5m ago', provider: 'AWS' },
  { id: 'AS-1004', name: 'CACHE-CLD-01', type: 'cloud', environment: 'Production', status: 'healthy', cpu: 19, memory: 37, disk: 44, network: 8, lastChecked: '3m ago', provider: 'AWS' },
  { id: 'AS-1005', name: 'K8S-POD-44', type: 'k8s-pod', environment: 'Production', status: 'warning', cpu: 57, memory: 64, disk: 42, network: 18, lastChecked: '7m ago', provider: 'Kubernetes' },
  { id: 'AS-1006', name: 'API-SRV-11', type: 'server', environment: 'Production', status: 'healthy', cpu: 13, memory: 31, disk: 39, network: 9, lastChecked: '4m ago', provider: 'Azure' },
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

export const mockIncidents: Incident[] = [
  { id: 'INC-2024-1247', title: 'Failed Login Attempts', severity: 'critical', sourceIp: '203.0.113.10', status: 'Open', assignedTeam: 'SOC', eta: '12 min', createdAt: '08:40 UTC' },
  { id: 'INC-2024-1248', title: 'Latency Spike', severity: 'high', sourceIp: '198.51.100.5', status: 'Assigned', assignedTeam: 'Network', eta: '25 min', createdAt: '08:12 UTC' },
  { id: 'INC-2024-1249', title: 'Token Replay Alert', severity: 'medium', sourceIp: '192.0.2.77', status: 'Investigation', assignedTeam: 'IAM', eta: '40 min', createdAt: '07:44 UTC' },
];

export const mockVulnerabilities: Vulnerability[] = [
  { id: 'VUL-001', cveId: 'CVE-2024-2382', severity: 'critical', cvss: 9.8, affectedAssets: 11, patchStatus: 'pending', riskScore: 92, lastScanSource: 'Trivy' },
  { id: 'VUL-002', cveId: 'CVE-2024-2143', severity: 'high', cvss: 8.7, affectedAssets: 6, patchStatus: 'tested', riskScore: 84, lastScanSource: 'SonarQube' },
  { id: 'VUL-003', cveId: 'CVE-2023-5038', severity: 'medium', cvss: 6.1, affectedAssets: 3, patchStatus: 'available', riskScore: 61, lastScanSource: 'Trivy' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'LOG-001', action: 'Login Granted', user: 'Ava Chen', timestamp: '2026-07-11 09:12', source: '10.10.1.21' },
  { id: 'LOG-002', action: 'Policy Updated', user: 'Daniel Kim', timestamp: '2026-07-11 08:49', source: '10.10.1.42' },
  { id: 'LOG-003', action: 'Export Report', user: 'Mina Patel', timestamp: '2026-07-11 08:07', source: '10.10.1.33' },
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
