import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { mockAlerts, mockAssets, mockAuditLogs, mockIncidents, mockMetrics, mockVulnerabilities } from '../data/mockAssets';
import type { Alert, Asset, AuditLog, Incident, Metric, Vulnerability } from '../types';

interface AppStateContextValue {
  assets: Asset[];
  alerts: Alert[];
  incidents: Incident[];
  vulnerabilities: Vulnerability[];
  auditLogs: AuditLog[];
  metrics: Metric[];
  updateAsset: (assetId: string, updater: (asset: Asset) => Asset) => void;
  updateIncident: (incidentId: string, updater: (incident: Incident) => Incident) => void;
  updateVulnerability: (vulnerabilityId: string, updater: (vulnerability: Vulnerability) => Vulnerability) => void;
  addAlert: (alert: Alert) => void;
  addIncident: (incident: Incident) => void;
  addAuditLog: (auditLog: AuditLog) => void;
  setMetrics: Dispatch<SetStateAction<Metric[]>>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(() => mockAssets.map((asset) => ({ ...asset })));
  const [alerts, setAlerts] = useState<Alert[]>(() => mockAlerts.map((alert) => ({ ...alert })));
  const [incidents, setIncidents] = useState<Incident[]>(() => mockIncidents.map((incident) => ({ ...incident })));
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(() => mockVulnerabilities.map((vulnerability) => ({ ...vulnerability, activityLog: [...(vulnerability.activityLog ?? [])], affectedAssetNames: [...(vulnerability.affectedAssetNames ?? [])] })));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => mockAuditLogs.map((auditLog) => ({ ...auditLog })));
  const [metrics, setMetrics] = useState<Metric[]>(() => mockMetrics.map((metric) => ({ ...metric })));

  const updateAsset = (assetId: string, updater: (asset: Asset) => Asset) => {
    setAssets((prev) => prev.map((asset) => (asset.id === assetId ? updater(asset) : asset)));
  };

  const updateIncident = (incidentId: string, updater: (incident: Incident) => Incident) => {
    setIncidents((prev) => prev.map((incident) => (incident.id === incidentId ? updater(incident) : incident)));
  };

  const updateVulnerability = (vulnerabilityId: string, updater: (vulnerability: Vulnerability) => Vulnerability) => {
    setVulnerabilities((prev) => prev.map((vulnerability) => (vulnerability.id === vulnerabilityId ? updater(vulnerability) : vulnerability)));
  };

  const addAlert = (alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
  };

  const addIncident = (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  const addAuditLog = (auditLog: AuditLog) => {
    setAuditLogs((prev) => [auditLog, ...prev]);
  };

  const value = useMemo(
    () => ({ assets, alerts, incidents, vulnerabilities, auditLogs, metrics, updateAsset, updateIncident, updateVulnerability, addAlert, addIncident, addAuditLog, setMetrics }),
    [assets, alerts, incidents, vulnerabilities, auditLogs, metrics],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
