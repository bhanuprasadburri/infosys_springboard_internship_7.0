import type { Asset, CloudResource, HealthMetric } from '../types';
interface AssetHealthPanelProps {
    assets: Asset[];
    metrics: HealthMetric[];
    cloudResources: CloudResource[];
    summary: {
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
    };
}
export default function AssetHealthPanel({ assets, metrics, cloudResources, summary }: AssetHealthPanelProps): import("react").JSX.Element;
export {};
