// @ts-ignore
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001/api';

// Helper: handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API Error: ${response.status}`);
  }
  return response.json();
};

export const apiClient = {
  // ===== Assets =====
  getAssets: () =>
    fetch(`${API_BASE}/assets`).then(handleResponse),
  createAsset: (asset: any) =>
    fetch(`${API_BASE}/assets`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(asset) }).then(handleResponse),
  updateAsset: (id: string, asset: any) =>
    fetch(`${API_BASE}/assets/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(asset) }).then(handleResponse),
  deleteAsset: (id: string) =>
    fetch(`${API_BASE}/assets/${id}`, { method: 'DELETE' }).then(handleResponse),

  // ===== Alerts =====
  getAlerts: () =>
    fetch(`${API_BASE}/alerts`).then(handleResponse),
  createAlert: (alert: any) =>
    fetch(`${API_BASE}/alerts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(alert) }).then(handleResponse),

  // ===== Incidents =====
  getIncidents: () =>
    fetch(`${API_BASE}/incidents`).then(handleResponse),
  createIncident: (incident: any) =>
    fetch(`${API_BASE}/incidents`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(incident) }).then(handleResponse),
  updateIncident: (id: string, incident: any) =>
    fetch(`${API_BASE}/incidents/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(incident) }).then(handleResponse),
  deleteIncident: (id: string) =>
    fetch(`${API_BASE}/incidents/${id}`, { method: 'DELETE' }).then(handleResponse),

  // ===== Vulnerabilities =====
  getVulnerabilities: () =>
    fetch(`${API_BASE}/vulnerabilities`).then(handleResponse),
  createVulnerability: (vulnerability: any) =>
    fetch(`${API_BASE}/vulnerabilities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vulnerability) }).then(handleResponse),
  updateVulnerability: (id: string, vulnerability: any) =>
    fetch(`${API_BASE}/vulnerabilities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vulnerability) }).then(handleResponse),

  // ===== Audit Logs =====
  getAuditLogs: () =>
    fetch(`${API_BASE}/audit-logs`).then(handleResponse),
  createAuditLog: (log: any) =>
    fetch(`${API_BASE}/audit-logs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(log) }).then(handleResponse),

  // ===== Metrics =====
  getMetrics: () =>
    fetch(`${API_BASE}/metrics`).then(handleResponse),
  updateMetrics: (metrics: any) =>
    fetch(`${API_BASE}/metrics`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(metrics) }).then(handleResponse),

  // ===== Health =====
  health: () =>
    fetch(`${API_BASE}/health`).then(handleResponse),
};
