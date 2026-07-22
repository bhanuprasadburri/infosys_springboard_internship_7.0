import { createContext, useContext, useMemo, useState, useEffect, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { mockAlerts, mockAssets, mockAuditLogs, mockIncidents, mockMetrics, mockVulnerabilities } from '../data/mockAssets';
import { apiClient } from '../api/client';
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

  // Initialize from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [backendAssets, backendAlerts, backendIncidents, backendVulnerabilities, backendAuditLogs, backendMetrics] = await Promise.all([
          apiClient.getAssets().catch(() => mockAssets),
          apiClient.getAlerts().catch(() => mockAlerts),
          apiClient.getIncidents().catch(() => mockIncidents),
          apiClient.getVulnerabilities().catch(() => mockVulnerabilities),
          apiClient.getAuditLogs().catch(() => mockAuditLogs),
          apiClient.getMetrics().catch(() => mockMetrics),
        ]);
        setAssets(backendAssets || mockAssets);
        setAlerts(backendAlerts || mockAlerts);
        setIncidents(backendIncidents || mockIncidents);
        setVulnerabilities(backendVulnerabilities || mockVulnerabilities);
        setAuditLogs(backendAuditLogs || mockAuditLogs);
        setMetrics(backendMetrics || mockMetrics);
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error);
      }
    };
    loadData();
  }, []);

  const updateAsset = (assetId: string, updater: (asset: Asset) => Asset) => {
    setAssets((prev) => {
      const next = prev.map((asset) => (asset.id === assetId ? updater(asset) : asset));
      const updated = next.find((a) => a.id === assetId);
      if (updated) {
        apiClient.updateAsset(assetId, updated).catch((error) => console.error('Failed to update asset:', error));
      }
      return next;
    });
  };

  const updateIncident = (incidentId: string, updater: (incident: Incident) => Incident) => {
    setIncidents((prev) => {
      const next = prev.map((incident) => (incident.id === incidentId ? updater(incident) : incident));
      const updated = next.find((i) => i.id === incidentId);
      if (updated) {
        apiClient.updateIncident(incidentId, updated).catch((error) => console.error('Failed to update incident:', error));
      }
      return next;
    });
  };

  const updateVulnerability = (vulnerabilityId: string, updater: (vulnerability: Vulnerability) => Vulnerability) => {
    setVulnerabilities((prev) => {
      const next = prev.map((vulnerability) => (vulnerability.id === vulnerabilityId ? updater(vulnerability) : vulnerability));
      const updated = next.find((v) => v.id === vulnerabilityId);
      if (updated) {
        apiClient.updateVulnerability(vulnerabilityId, updated).catch((error) => console.error('Failed to update vulnerability:', error));
      }
      return next;
    });
  };

  const addAlert = (alert: Alert) => {
    setAlerts((prev) => [alert, ...prev]);
    apiClient.createAlert(alert).catch((error) => console.error('Failed to create alert:', error));
  };

  const addIncident = (incident: Incident) => {
    setIncidents((prev) => [incident, ...prev]);
    apiClient.createIncident(incident).catch((error) => console.error('Failed to create incident:', error));
  };

  const addAuditLog = (auditLog: AuditLog) => {
    setAuditLogs((prev) => [auditLog, ...prev]);
    apiClient.createAuditLog(auditLog).catch((error) => console.error('Failed to create audit log:', error));
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
