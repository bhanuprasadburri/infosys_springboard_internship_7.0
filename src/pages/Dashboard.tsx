import { useEffect, useState } from 'react';
import { Box, Chip, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import AssetHealthPanel from '../components/AssetHealthPanel';
import AlertsFeed from '../components/AlertsFeed';
import { alerts as initialAlerts, assets as initialAssets, cloudResources, dashboardSummary, healthMetrics as initialMetrics } from '../data/mockData';
import type { Alert, Asset, HealthMetric } from '../types';

const featureRoutes = ['/', '/assets'];

function PlaceholderView(pathname: string) {
  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
      <Typography variant="h5" sx={{ color: '#f5f7fa', fontWeight: 700 }}>
        {pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        This milestone keeps the experience focused on infrastructure monitoring. Later milestones will unlock incident, vulnerability, audit, compliance, and DevSecOps workflows here.
      </Typography>
      <Chip label="Disabled placeholder" color="default" sx={{ mt: 2 }} />
    </Paper>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const pathname = location.pathname;
  const [loading, setLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [metrics, setMetrics] = useState<HealthMetric[]>(initialMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          const drift = (Math.random() - 0.5) * 4;
          const nextValue = Math.max(5, Math.min(98, metric.value + drift));
          const status = nextValue >= metric.threshold ? 'critical' : nextValue >= metric.threshold * 0.7 ? 'warning' : 'healthy';
          return { ...metric, value: Math.round(nextValue * 10) / 10, status };
        }),
      );

      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          const drift = (Math.random() - 0.5) * 8;
          const nextCpu = Math.max(8, Math.min(98, asset.cpu + drift));
          const status = nextCpu >= 85 ? 'critical' : nextCpu >= 70 ? 'warning' : 'healthy';
          return { ...asset, cpu: Math.round(nextCpu), status };
        }),
      );

      setAlerts((prevAlerts) =>
        prevAlerts.map((alert, index) => (index === 0 ? { ...alert, message: alert.message.includes('Resolved') ? alert.message.replace('Resolved', 'Monitoring') : alert.message } : alert)),
      );
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const content = featureRoutes.includes(pathname) ? (
    <>
      <Typography variant="h4" sx={{ color: '#f5f7fa', fontWeight: 700, mb: 2 }}>
        Servers, Cloud, Network Health
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
        <Box>
          <StatCard title="Assets Monitored" value="2,847" subtitle="Servers+Cloud" />
        </Box>
        <Box>
          <StatCard title="Uptime" value={dashboardSummary.uptime} subtitle="SLA" />
        </Box>
        <Box>
          <StatCard title="Alerts" value={dashboardSummary.activeAlerts.toString()} subtitle="Active" />
        </Box>
      </Box>

      <AssetHealthPanel assets={assets} metrics={metrics} cloudResources={cloudResources} summary={dashboardSummary} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2, mt: 2 }}>
        <Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1.5 }}>
              Asset Inventory
            </Typography>
            <Stack spacing={1.2}>
              {assets.map((asset) => (
                <Box key={asset.id} sx={{ p: 1.3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#f5f7fa' }}>{asset.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asset.type} • {asset.environment} • {asset.provider}
                      </Typography>
                    </Box>
                    <Chip label={asset.status} color={asset.status === 'critical' ? 'error' : asset.status === 'warning' ? 'warning' : 'success'} size="small" />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
        <Box>
          <AlertsFeed alerts={alerts} />
        </Box>
      </Box>
    </>
  ) : (
    PlaceholderView(pathname)
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar pathname={pathname} />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, minHeight: 'calc(100vh - 72px)' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress color="error" />
            </Box>
          ) : (
            content
          )}
        </Box>
      </Box>
    </Box>
  );
}
