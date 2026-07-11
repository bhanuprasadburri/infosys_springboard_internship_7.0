import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import AlertsFeed from '../components/AlertsFeed';
import { mockAlerts, mockAssets, mockMetrics } from '../data/mockAssets';
import type { Asset, Alert, Metric } from '../types';

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMetrics((prev) => prev.map((metric) => ({ ...metric, value: Math.max(5, Math.min(98, metric.value + (Math.random() - 0.5) * 6)) })));
      setAssets((prev) => prev.map((asset) => ({ ...asset, cpu: Math.max(8, Math.min(98, asset.cpu + (Math.random() - 0.5) * 10)) })));
      setAlerts((prev) => prev.slice(0, 3));
    }, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const summary = useMemo(() => ({
    totalAssets: 2847,
    uptime: '99.99%',
    alerts: 12,
    healthy: 1235,
    warning: 10,
    critical: 2,
  }), []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ color: '#f5f7fa', fontWeight: 700, mb: 2 }}>
            Servers, Cloud, Network Health
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Assets Monitored" value="2,847" subtitle="Servers+Cloud" />
            <StatCard title="Uptime" value={summary.uptime} subtitle="SLA" />
            <StatCard title="Alerts" value={summary.alerts.toString()} subtitle="Active" />
          </Box>

          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Asset Service - Infrastructure Health
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Server Breakdown</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Total</Typography><Typography>1,247</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Healthy</Typography><Typography color="success.main">1,235</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Warning</Typography><Typography color="warning.main">10</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Critical</Typography><Typography color="error.main">2</Typography></Box>
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Cloud Breakdown</Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">AWS</Typography><Typography>847</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Azure</Typography><Typography>400</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">K8s Clusters</Typography><Typography>47</Typography></Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Pods</Typography><Typography>2,847</Typography></Box>
                </Stack>
              </Paper>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mt: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Resource Averages</Typography>
                <Stack spacing={1.4}>
                  {metrics.map((metric) => (
                    <Box key={metric.label}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{metric.label}</Typography>
                        <Typography variant="body2" color="text.secondary">{metric.value}{metric.unit}</Typography>
                      </Box>
                      <Box sx={{ height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.1)' }}>
                        <Box sx={{ height: '100%', width: `${metric.value}%`, bgcolor: metric.value >= 80 ? '#d32f2f' : metric.value >= 60 ? '#ed6c02' : '#2e7d32', borderRadius: 999 }} />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Health Summary</Typography>
                <Typography variant="body2" color="text.secondary">Uptime: 99.99% • Outages: 0 • Status: Within SLA</Typography>
                <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                  {assets.slice(0, 4).map((asset) => (
                    <Box key={asset.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{asset.name}</Typography>
                      <Chip label={asset.status} color={asset.status === 'critical' ? 'error' : asset.status === 'warning' ? 'warning' : 'success'} size="small" />
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
              <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>View Assets</Button>
              <Button variant="outlined" color="warning">Scale</Button>
              <Button variant="outlined" color="info">Investigate</Button>
            </Stack>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1.5 }}>Asset Inventory</Typography>
              <Stack spacing={1.2}>
                {assets.map((asset) => (
                  <Box key={asset.id} sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2">{asset.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{asset.type} • {asset.environment} • {asset.provider}</Typography>
                      </Box>
                      <Chip label={asset.status} color={asset.status === 'critical' ? 'error' : asset.status === 'warning' ? 'warning' : 'success'} size="small" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
            <AlertsFeed alerts={alerts} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
