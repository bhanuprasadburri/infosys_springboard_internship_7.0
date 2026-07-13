import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import AlertsFeed from '../components/AlertsFeed';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';
import type { Asset, Incident } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assets, alerts, metrics, updateAsset, addAlert, addIncident, addAuditLog, setMetrics } = useAppState();
  const [scaleTarget, setScaleTarget] = useState<Asset | null>(null);
  const [scaling, setScaling] = useState(false);
  const [drawerAsset, setDrawerAsset] = useState<Asset | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

  const canScale = canPerformAction(user, 'scale');
  const canEscalate = canPerformAction(user, 'assign') || canPerformAction(user, 'escalate');
  const canReview = canPerformAction(user, 'review');
  const canInvestigate = canPerformAction(user, 'escalate');

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMetrics((prev) => prev.map((metric) => ({ ...metric, value: Math.max(5, Math.min(98, metric.value + (Math.random() - 0.5) * 6)) })));
    }, 10000);
    return () => window.clearInterval(interval);
  }, [setMetrics]);

  const summary = useMemo(() => ({
    totalAssets: assets.length,
    uptime: '99.99%',
    alerts: alerts.length,
    healthy: assets.filter((asset) => asset.status === 'healthy').length,
    warning: assets.filter((asset) => asset.status === 'warning').length,
    critical: assets.filter((asset) => asset.status === 'critical').length,
  }), [alerts.length, assets]);

  const handleViewAssets = () => {
    const target = assets.find((asset) => asset.status !== 'healthy') ?? assets[0];
    navigate(`/assets?status=${target?.status ?? 'healthy'}`);
  };

  const handleScaleClick = (asset: Asset) => {
    if (!canScale) {
      setToast({ open: true, message: 'Permission denied: cannot scale resources.', severity: 'error' });
      return;
    }
    setScaleTarget(asset);
  };

  const confirmScale = () => {
    if (!scaleTarget) return;
    setScaling(true);
    window.setTimeout(() => {
      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        setScaling(false);
        setScaleTarget(null);
        setToast({ open: true, message: '❌ Scaling failed — retry?', severity: 'error' });
        return;
      }

      updateAsset(scaleTarget.id, (asset) => ({
        ...asset,
        cpu: Math.max(8, asset.cpu - 24),
        memory: Math.max(8, asset.memory - 18),
        disk: Math.max(8, asset.disk - 6),
        network: Math.max(6, asset.network - 4),
        allocatedCapacity: asset.allocatedCapacity + 8,
        status: 'healthy',
        lastChecked: 'just now',
      }));
      addAlert({
        id: `ALT-${Date.now()}`,
        message: `${scaleTarget.name} — Auto-scaled — Resolved`,
        severity: 'high',
        source: 'Auto Scale',
        status: 'resolved',
        timestamp: 'just now',
        action: 'Scale',
      });
      addAuditLog({
        id: `LOG-${Date.now()}`,
        action: `Scaled ${scaleTarget.name}`,
        user: 'System',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        source: 'Dashboard',
      });
      setScaling(false);
      setScaleTarget(null);
      setToast({ open: true, message: `✅ Scaling triggered for ${scaleTarget.name} — new capacity applied`, severity: 'success' });
    }, 1500);
  };

  const handleInvestigate = (asset: Asset) => {
    setDrawerAsset(asset);
  };

  const handleEscalate = (asset: Asset) => {
    if (!canEscalate) {
      setToast({ open: true, message: 'Permission denied: cannot escalate incidents.', severity: 'error' });
      return;
    }
    const incident: Incident = {
      id: `INC-${Date.now()}`,
      title: `${asset.name} resource investigation`,
      severity: asset.status === 'critical' ? 'critical' : 'high',
      sourceIp: '10.0.0.1',
      status: 'Open',
      assignedTeam: 'SOC',
      assignee: 'Ava Chen',
      eta: '15 min',
      createdAt: 'just now',
      source: 'Dashboard Alert',
      type: 'Infrastructure',
      affectedAsset: asset.name,
      affectedUser: 'Ops Team',
      slaHours: asset.status === 'critical' ? 2 : 4,
      activityLog: ['Escalated from dashboard'],
      recommendedActions: ['Block IP', 'Reset password', 'Notify user'],
      notes: [],
    };
    addIncident(incident);
    addAuditLog({
      id: `LOG-${Date.now()}`,
      action: `Escalated ${asset.name} to incident ${incident.id}`,
      user: user?.fullName ?? 'System',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().slice(0, 10),
      source: 'Dashboard',
    });
    setDrawerAsset(null);
    navigate('/incidents');
    setToast({ open: true, message: `🚨 Escalated ${asset.name} to incidents`, severity: 'success' });
  };

  const handleReview = (asset: Asset) => {
    if (!canReview) {
      setToast({ open: true, message: 'Permission denied: cannot review assets.', severity: 'error' });
      return;
    }
    updateAsset(asset.id, (current) => ({ ...current, lastChecked: 'reviewed just now', lastReviewed: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }));
    addAuditLog({
      id: `LOG-${Date.now()}`,
      action: `Reviewed ${asset.name}`,
      user: user?.fullName ?? 'System',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().slice(0, 10),
      source: 'Dashboard',
    });
    setDrawerAsset(null);
    setToast({ open: true, message: `✓ ${asset.name} marked as reviewed`, severity: 'success' });
  };

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
              <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }} onClick={handleViewAssets}>View Assets</Button>
              <Button variant="outlined" color="warning" onClick={() => handleScaleClick(assets.find((asset) => asset.status !== 'healthy') ?? assets[0])} disabled={!canScale}>Scale</Button>
              <Button variant="outlined" color="info" onClick={() => handleInvestigate(assets.find((asset) => asset.status !== 'healthy') ?? assets[0])} disabled={!canInvestigate}>Investigate</Button>
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
      <Dialog open={Boolean(scaleTarget)} onClose={() => !scaling && setScaleTarget(null)}>
        <DialogTitle>Scale Resources</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to trigger auto-scaling for {scaleTarget?.name ?? 'this asset'}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScaleTarget(null)} disabled={scaling}>Cancel</Button>
          <Button onClick={confirmScale} variant="contained" color="warning" disabled={scaling}>
            {scaling ? <><CircularProgress size={16} sx={{ mr: 1 }} /> Scaling...</> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer anchor="right" open={Boolean(drawerAsset)} onClose={() => setDrawerAsset(null)}>
        <Box sx={{ width: { xs: '100vw', sm: 420 }, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>{drawerAsset?.name ?? 'Investigation'}</Typography>
          {drawerAsset && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2">Asset ID</Typography>
                <Typography color="text.secondary">{drawerAsset.id}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Current Metrics</Typography>
                <Typography color="text.secondary">CPU {drawerAsset.cpu}% • Memory {drawerAsset.memory}% • Disk {drawerAsset.disk}% • Network {drawerAsset.network}%</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Status history</Typography>
                <Typography color="text.secondary">• Detected at {drawerAsset.lastChecked}</Typography>
                <Typography color="text.secondary">• Reviewed: {drawerAsset.lastReviewed ?? 'pending'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Related alert</Typography>
                <Typography color="text.secondary">{alerts[0]?.message ?? 'No alert available'}</Typography>
              </Box>
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" color="error" onClick={() => handleEscalate(drawerAsset)} disabled={!canEscalate}>Escalate to Incident</Button>
                <Button variant="outlined" onClick={() => handleReview(drawerAsset)} disabled={!canReview}>Mark as Reviewed</Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Drawer>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
