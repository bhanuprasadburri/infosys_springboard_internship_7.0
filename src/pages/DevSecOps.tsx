import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';

export default function DevSecOps() {
  const { incidents, vulnerabilities, auditLogs, addAuditLog } = useAppState();
  const { user } = useAuth();
  const canReview = canPerformAction(user, 'review');
  const [runningCheck, setRunningCheck] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; summary: string; findings: string[] } | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const reviewHistory = useMemo(() => {
    return auditLogs
      .filter((entry) => entry.source === 'DevSecOps')
      .map((entry) => ({
        id: entry.id,
        timestamp: entry.timestamp,
        findings: entry.action.includes('found issues') ? Number(entry.action.match(/([0-9]+) unresolved critical CVEs/)?.[1] ?? 0) : 0,
        approved: entry.action.includes('passed'),
        action: entry.action,
      }));
  }, [auditLogs]);

  const latestReview = reviewHistory[0];

  const summary = useMemo(() => {
    const criticalCves = vulnerabilities.filter((vulnerability) => vulnerability.severity === 'critical' && vulnerability.patchStatus !== 'patched').length;
    const overdueSla = incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Closed' && incident.slaHours && incident.slaHours <= 2).length;
    const avgRisk = Math.round(vulnerabilities.reduce((sum, vulnerability) => sum + vulnerability.riskScore, 0) / Math.max(vulnerabilities.length, 1));
    return { criticalCves, overdueSla, avgRisk, auditIntegrity: auditLogs.length > 0 };
  }, [incidents, vulnerabilities, auditLogs]);

  const runCheck = () => {
    if (!canReview) {
      setToast({ open: true, message: 'Permission denied: cannot run compliance checks.' });
      return;
    }
    setRunningCheck(true);
    setResult(null);
    window.setTimeout(() => {
      const findings: string[] = [];
      if (summary.criticalCves > 0) findings.push(`${summary.criticalCves} unresolved critical CVE(s)`);
      if (summary.overdueSla > 0) findings.push(`${summary.overdueSla} incident(s) past SLA`);
      if (!summary.auditIntegrity) findings.push('Audit log integrity check failed');
      const passed = findings.length === 0;
      const nextResult = { passed, summary: passed ? 'Compliance Check Passed' : 'Compliance Check Found Issues', findings };
      setResult(nextResult);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addAuditLog({ id: `AUD-${Date.now()}`, action: `DevSecOps compliance check ${passed ? 'passed' : `found issues: ${findings.join(', ')}`}`, user: user?.fullName ?? 'Unknown', timestamp, date: new Date().toISOString().slice(0, 10), source: 'DevSecOps' });
      setRunningCheck(false);
      setToast({ open: true, message: passed ? '✅ Compliance Check Passed' : '⚠️ Compliance Check Found Issues' });
    }, 2000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>DevSecOps Dashboard</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="SonarQube Critical" value={summary.criticalCves.toString()} subtitle="Unpatched CVEs" />
            <StatCard title="OWASP Scan" value={summary.criticalCves > 0 ? '❌ Failed' : '✅ Passed'} subtitle="Status" />
            <StatCard title="Risk Score" value={summary.avgRisk.toString()} subtitle="Average" />
          </Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Security Review Status</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Last review: {latestReview?.timestamp ?? 'Pending'}</Typography>
              <Typography variant="body2" color="text.secondary">Status: {latestReview?.approved ? '✅ Approved' : '⏳ Pending review'}</Typography>
              <Typography variant="body2" color={summary.auditIntegrity ? 'success.main' : 'error.main'}>Audit log integrity: {summary.auditIntegrity ? 'Verified' : 'Failed'}</Typography>
              <Typography variant="body2" color="text.secondary">Total reviews: {reviewHistory.length}</Typography>
            </Stack>
          </Paper>
          <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }} onClick={runCheck} disabled={runningCheck || !canReview}>
            {runningCheck ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {runningCheck ? 'Running compliance check...' : 'Compliance Check'}
          </Button>
          {result && (
            <Paper elevation={0} sx={{ p: 2.5, mt: 2, bgcolor: result.passed ? 'rgba(46, 125, 50, 0.12)' : 'rgba(237, 108, 2, 0.14)', border: `1px solid ${result.passed ? 'rgba(46, 125, 50, 0.3)' : 'rgba(237, 108, 2, 0.3)'}`, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, color: result.passed ? 'success.main' : 'warning.main' }}>
                {result.passed ? '✅ Compliance Check Passed' : '⚠️ Compliance Check Found Issues'}
              </Typography>
              {result.findings.length > 0 && (
                <Stack spacing={0.75}>
                  {result.findings.map((finding) => (
                    <Typography key={finding} variant="body2" color="text.secondary">• {finding}</Typography>
                  ))}
                </Stack>
              )}
              <Button variant="outlined" size="small" onClick={runCheck} disabled={runningCheck} sx={{ mt: 2 }}>Re-run Check</Button>
            </Paper>
          )}
          <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Security Reviews History</Typography>
            {reviewHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No DevSecOps reviews have been recorded yet.</Typography>
            ) : (
              <Stack spacing={1}>
                {reviewHistory.map((entry) => (
                  <Box key={entry.id} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2, borderLeft: `3px solid ${entry.approved ? '#2e7d32' : '#ed6c02'}` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{entry.timestamp}</Typography>
                      <Chip label={entry.approved ? '✅ Passed' : '⚠️ Issues'} size="small" color={entry.approved ? 'success' : 'warning'} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">{entry.action}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Box>
      <Dialog open={Boolean(result)} onClose={() => setResult(null)}>
        <DialogTitle>{result?.summary}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Typography color={result?.passed ? 'success.main' : 'warning.main'}>{result?.passed ? '✅ Compliance Check Passed' : '⚠️ Compliance Check Found Issues'}</Typography>
            {result?.findings.map((finding) => <Typography key={finding} color="text.secondary">• {finding}</Typography>)}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResult(null)}>Close</Button>
          <Button variant="contained" onClick={runCheck}>Re-run Check</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
