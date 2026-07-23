import { Box, Chip, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import type { Asset, CloudResource, HealthMetric } from '../types';
import ActionButtons from './ActionButtons';

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

const statusColor = {
  healthy: 'success.main',
  warning: 'warning.main',
  critical: 'error.main',
} as const;

export default function AssetHealthPanel({ assets, metrics, cloudResources, summary }: AssetHealthPanelProps) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: '0 10px 24px rgba(15,23,42,0.04)' }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', lg: 'center' }} spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700 }}>
            Asset Service - Infrastructure Health
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Live infrastructure posture for assets, cloud workloads, and network resilience.
          </Typography>
        </Box>
        <Chip label={`SLA ${summary.slaStatus}`} color={summary.slaStatus === 'Within SLA' ? 'success' : 'warning'} />
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mt: 1 }}>
        <Box>
          <Paper elevation={0} sx={{ p: 2.2, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
              Server Breakdown
            </Typography>
            <Stack spacing={1.1}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Total</Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{summary.serversTotal}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Healthy</Typography>
                <Typography sx={{ color: statusColor.healthy, fontWeight: 600 }}>{summary.serversHealthy}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Warning</Typography>
                <Typography sx={{ color: statusColor.warning, fontWeight: 600 }}>{summary.serversWarning}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Critical</Typography>
                <Typography sx={{ color: statusColor.critical, fontWeight: 600 }}>{summary.serversCritical}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={0} sx={{ p: 2.2, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
              Cloud Breakdown
            </Typography>
            <Stack spacing={1.1}>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">AWS</Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{summary.awsCount}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Azure</Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{summary.azureCount}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">K8s Clusters</Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{summary.kubernetesClusters}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography color="text.secondary">Pods</Typography>
                <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{summary.kubernetesPods}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mt: 0.5 }}>
        <Box>
          <Paper elevation={0} sx={{ p: 2.2, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
              Resource Averages
            </Typography>
            <Stack spacing={1.6}>
              {metrics.map((metric) => (
                <Box key={metric.label}>
                  <Box display="flex" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>{metric.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{metric.value}{metric.unit}</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={metric.value} color={metric.status === 'critical' ? 'error' : metric.status === 'warning' ? 'warning' : 'success'} sx={{ height: 8, borderRadius: 999 }} />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Box>
          <Paper elevation={0} sx={{ p: 2.2, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
              Health Summary
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', mb: 1, fontWeight: 500 }}>
              Uptime: {summary.cpuAverage}% • Outages: {summary.outages} • Status: {summary.slaStatus}
            </Typography>
            <Divider sx={{ my: 1.5, borderColor: 'divider' }} />
            <Stack spacing={1.2}>
              {assets.slice(0, 4).map((asset) => (
                <Box key={asset.id} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>{asset.name}</Typography>
                  <Chip label={asset.status} color={asset.status === 'critical' ? 'error' : asset.status === 'warning' ? 'warning' : 'success'} size="small" />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Typography variant="subtitle1" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 600 }}>
          Cloud Resources
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5 }}>
          {cloudResources.map((resource) => (
            <Box key={resource.name}>
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 10 }}>
                <Typography variant="body2" sx={{ color: 'text.primary' }}>{resource.name}</Typography>
                <Typography variant="caption" color="text.secondary">{resource.provider} • {resource.type}</Typography>
                <Typography variant="h6" sx={{ color: 'text.primary', mt: 0.75 }}>{resource.count}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>

      <ActionButtons />
    </Paper>
  );
}
