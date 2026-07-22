const fs = require('fs');
const path = require('path');

// Import mock data from frontend
const mockData = {
  assets: [
    { id: 'AST-001', name: 'prod-web-01', type: 'server', status: 'healthy', environment: 'production', provider: 'On-Premises', cpu: 45, memory: 62, disk: 38, network: 12, allocatedCapacity: 85, lastChecked: '2 min ago' },
    { id: 'AST-002', name: 'prod-db-01', type: 'cloud', status: 'warning', environment: 'production', provider: 'Azure', cpu: 72, memory: 81, disk: 55, network: 28, allocatedCapacity: 92, lastChecked: '1 min ago' },
    { id: 'AST-003', name: 'k8s-cluster-01', type: 'k8s-pod', status: 'critical', environment: 'staging', provider: 'Kubernetes', cpu: 88, memory: 91, disk: 73, network: 45, allocatedCapacity: 98, lastChecked: 'just now' },
  ],
  alerts: [
    { id: 'ALT-001', message: 'prod-db-01 — High memory utilization', severity: 'high', source: 'CloudWatch', status: 'active', timestamp: '5 min ago', action: 'Investigate' },
    { id: 'ALT-002', message: 'k8s-cluster-01 — Pod crash detected', severity: 'critical', source: 'Kubernetes', status: 'active', timestamp: '2 min ago', action: 'Escalate' },
  ],
  incidents: [
    { id: 'INC-001', title: 'Unauthorized access attempt', severity: 'critical', sourceIp: '203.0.113.45', status: 'Open', assignedTeam: 'Security Team', assignee: '', eta: '2h', createdAt: '3 hours ago', source: 'SIEM', type: 'Intrusion', affectedAsset: 'prod-web-01', affectedUser: 'Unknown', slaHours: 2, activityLog: ['Created from alert'], recommendedActions: ['Block IP', 'Review logs'], notes: [] },
    { id: 'INC-002', title: 'SSL certificate expiring soon', severity: 'high', sourceIp: '10.0.0.1', status: 'Assigned', assignedTeam: 'Network Team', assignee: 'Daniel Kim', eta: '4h', createdAt: '1 hour ago', source: 'Certificate Monitor', type: 'Infrastructure', affectedAsset: 'prod-web-01', affectedUser: 'DevOps', slaHours: 4, activityLog: ['Assigned to Network Team'], recommendedActions: ['Renew certificate'], notes: [] },
  ],
  vulnerabilities: [
    { id: 'VUL-001', cveId: 'CVE-2024-2382', severity: 'critical', cvss: 9.8, affectedAssets: 3, patchStatus: 'available', riskScore: 92, previousRiskScore: 92, lastScanSource: 'Trivy', lastScanTimestamp: '2026-07-10 08:32', affectedAssetNames: ['prod-web-01', 'prod-db-01', 'k8s-cluster-01'], activityLog: [] },
    { id: 'VUL-002', cveId: 'CVE-2024-2143', severity: 'high', cvss: 8.7, affectedAssets: 2, patchStatus: 'pending', riskScore: 72, previousRiskScore: 72, lastScanSource: 'SonarQube', lastScanTimestamp: '2026-07-09 06:15', affectedAssetNames: ['prod-db-01', 'prod-web-01'], activityLog: [] },
    { id: 'VUL-003', cveId: 'CVE-2023-5038', severity: 'medium', cvss: 6.1, affectedAssets: 1, patchStatus: 'tested', riskScore: 55, previousRiskScore: 55, lastScanSource: 'Trivy', lastScanTimestamp: '2026-07-08 15:05', affectedAssetNames: ['k8s-cluster-01'], activityLog: [] },
    { id: 'VUL-004', cveId: 'CVE-2024-3847', severity: 'critical', cvss: 9.5, affectedAssets: 2, patchStatus: 'patched', riskScore: 52, previousRiskScore: 92, lastScanSource: 'OpenVAS', lastScanTimestamp: '2026-07-07 12:00', affectedAssetNames: ['prod-web-01', 'k8s-cluster-01'], activityLog: ['Patched successfully'] },
    { id: 'VUL-005', cveId: 'CVE-2024-4102', severity: 'high', cvss: 8.2, affectedAssets: 2, patchStatus: 'available', riskScore: 70, previousRiskScore: 70, lastScanSource: 'Nessus', lastScanTimestamp: '2026-07-06 14:30', affectedAssetNames: ['prod-db-01', 'k8s-cluster-01'], activityLog: [] },
  ],
  auditLogs: [
    { id: 'AUD-001', action: 'Login', user: 'Alice Johnson', timestamp: '10:25 AM', date: new Date().toISOString().slice(0, 10), source: 'Authentication' },
    { id: 'AUD-002', action: 'Escalated prod-web-01 to incident', user: 'Bob Smith', timestamp: '10:20 AM', date: new Date().toISOString().slice(0, 10), source: 'Dashboard' },
  ],
  metrics: [
    { label: 'CPU', value: 68, unit: '%', threshold: 80, status: 'warning' },
    { label: 'Memory', value: 78, unit: '%', threshold: 85, status: 'warning' },
    { label: 'Disk', value: 55, unit: '%', threshold: 90, status: 'healthy' },
    { label: 'Network', value: 28, unit: '%', threshold: 95, status: 'healthy' },
  ],
};

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Map camelCase to endpoint naming (hyphenated)
const fileNameMap = {
  assets: 'assets',
  alerts: 'alerts',
  incidents: 'incidents',
  vulnerabilities: 'vulnerabilities',
  auditLogs: 'audit-logs',
  metrics: 'metrics'
};

Object.entries(mockData).forEach(([key, value]) => {
  const fileName = fileNameMap[key] || key;
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  console.log(`✓ Seeded ${fileName}.json`);
});

console.log('\n✓ Backend data seeded successfully!');
