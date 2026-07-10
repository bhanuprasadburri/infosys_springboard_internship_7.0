export type AssetStatus = 'healthy' | 'warning' | 'critical';
export type AssetType = 'server' | 'cloud' | 'k8s-pod';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus = 'active' | 'resolved' | 'investigating';
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
