export type Role = 'Security Admin' | 'Auditor' | 'Viewer';
export type AssetStatus = 'healthy' | 'warning' | 'critical';
export type AssetType = 'server' | 'cloud' | 'k8s-pod';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'resolved' | 'investigating';
export type IncidentStatus = 'Open' | 'Assigned' | 'Investigation' | 'Resolved';
export type VulnerabilityStatus = 'available' | 'tested' | 'pending';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  environment: string;
  provider?: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  lastChecked: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: AlertSeverity;
  sourceIp: string;
  status: IncidentStatus;
  assignedTeam: string;
  eta: string;
  createdAt: string;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  severity: AlertSeverity;
  cvss: number;
  affectedAssets: number;
  patchStatus: VulnerabilityStatus;
  riskScore: number;
  lastScanSource: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  source: string;
}

export interface ComplianceReport {
  framework: string;
  status: 'Compliant' | 'Review';
}

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
  source: string;
  status: AlertStatus;
  timestamp: string;
  action: string;
}

export interface HealthMetric {
  label: string;
  value: number;
  unit: string;
  threshold: number;
  status: AssetStatus;
}

export interface CloudResource {
  name: string;
  provider: 'AWS' | 'Azure' | 'Kubernetes';
  type: string;
  count: number;
  status: AssetStatus;
}

export interface Metric {
  label: string;
  value: number;
  unit: string;
  threshold: number;
  status: AssetStatus;
}

export interface Policy {
  id: string;
  name: string;
  owner: string;
  status: 'Enabled' | 'Review';
}

export interface Report {
  id: string;
  name: string;
  type: string;
  generatedAt: string;
}

export interface DashboardSummary {
  totalAssets: number;
  uptime: string;
  activeAlerts: number;
  serversTotal: number;
  serversHealthy: number;
  serversWarning: number;
  serversCritical: number;
  awsCount: number;
  azureCount: number;
  kubernetesClusters: number;
  kubernetesPods: number;
  cpuAverage: number;
  memoryAverage: number;
  diskAverage: number;
  networkAverage: number;
  outages: number;
  slaStatus: string;
}
