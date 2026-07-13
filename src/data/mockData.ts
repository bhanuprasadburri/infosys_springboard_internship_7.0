import type { Alert, Asset, CloudResource, DashboardSummary, HealthMetric } from '../types';

export const dashboardSummary: DashboardSummary = {
  totalAssets: 2847,
  uptime: '99.99%',
  activeAlerts: 12,
  serversTotal: 1247,
  serversHealthy: 1235,
  serversWarning: 10,
  serversCritical: 2,
  awsCount: 847,
  azureCount: 400,
  kubernetesClusters: 47,
  kubernetesPods: 2847,
  cpuAverage: 23,
  memoryAverage: 47,
  diskAverage: 67,
  networkAverage: 12,
  outages: 0,
  slaStatus: 'Within SLA',
};

export const assets: Asset[] = [
  { id: 'AS-1001', name: 'DB-SRV-12', type: 'server', status: 'critical', environment: 'Production', provider: 'AWS', cpu: 94, memory: 81, disk: 67, network: 32, allocatedCapacity: 24, lastChecked: '2m ago' },
  { id: 'AS-1002', name: 'APP-SRV-03', type: 'server', status: 'healthy', environment: 'Production', provider: 'Azure', cpu: 21, memory: 44, disk: 58, network: 11, allocatedCapacity: 18, lastChecked: '4m ago' },
  { id: 'AS-1003', name: 'WEB-SRV-08', type: 'server', status: 'warning', environment: 'Staging', provider: 'AWS', cpu: 68, memory: 73, disk: 51, network: 23, allocatedCapacity: 20, lastChecked: '8m ago' },
  { id: 'AS-1004', name: 'CACHE-CLD-01', type: 'cloud', status: 'healthy', environment: 'Production', provider: 'AWS', cpu: 19, memory: 37, disk: 44, network: 8, allocatedCapacity: 16, lastChecked: '6m ago' },
  { id: 'AS-1005', name: 'K8S-POD-44', type: 'k8s-pod', status: 'warning', environment: 'Production', provider: 'Kubernetes', cpu: 57, memory: 64, disk: 42, network: 18, allocatedCapacity: 12, lastChecked: '10m ago' },
  { id: 'AS-1006', name: 'API-SRV-11', type: 'server', status: 'healthy', environment: 'Production', provider: 'Azure', cpu: 13, memory: 31, disk: 39, network: 9, allocatedCapacity: 14, lastChecked: '3m ago' },
  { id: 'AS-1007', name: 'K8S-POD-77', type: 'k8s-pod', status: 'critical', environment: 'Development', provider: 'Kubernetes', cpu: 91, memory: 78, disk: 72, network: 41, allocatedCapacity: 10, lastChecked: '1m ago' },
  { id: 'AS-1008', name: 'DATA-CLD-02', type: 'cloud', status: 'healthy', environment: 'Production', provider: 'Azure', cpu: 25, memory: 28, disk: 35, network: 15, allocatedCapacity: 15, lastChecked: '5m ago' },
];

export const alerts: Alert[] = [
  { id: 'ALT-001', message: 'DB-SRV-12 CPU 94% — Auto-scaled — Resolved', severity: 'critical', source: 'CPU Monitor', status: 'resolved', timestamp: '2m ago', action: 'Scale' },
  { id: 'ALT-002', message: 'K8S-POD-77 Memory spike — Investigating', severity: 'high', source: 'Kubernetes', status: 'investigating', timestamp: '6m ago', action: 'Investigate' },
  { id: 'ALT-003', message: 'WEB-SRV-08 Latency above threshold', severity: 'medium', source: 'Network Monitor', status: 'active', timestamp: '12m ago', action: 'View Assets' },
  { id: 'ALT-004', message: 'APP-SRV-03 Disk usage trending high', severity: 'low', source: 'Health Checks', status: 'active', timestamp: '18m ago', action: 'Investigate' },
];

export const healthMetrics: HealthMetric[] = [
  { label: 'CPU', value: 23, unit: '%', threshold: 80, status: 'healthy' },
  { label: 'Memory', value: 47, unit: '%', threshold: 75, status: 'healthy' },
  { label: 'Disk', value: 67, unit: '%', threshold: 85, status: 'warning' },
  { label: 'Network', value: 12, unit: '%', threshold: 60, status: 'healthy' },
];

export const cloudResources: CloudResource[] = [
  { name: 'AWS Production', provider: 'AWS', type: 'Accounts', count: 847, status: 'healthy' },
  { name: 'Azure Core', provider: 'Azure', type: 'Subscriptions', count: 400, status: 'healthy' },
  { name: 'Cluster-01', provider: 'Kubernetes', type: 'Clusters', count: 47, status: 'warning' },
  { name: 'Pods', provider: 'Kubernetes', type: 'Pods', count: 2847, status: 'healthy' },
];
