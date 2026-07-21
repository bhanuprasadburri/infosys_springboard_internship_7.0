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
    const critical = vulnerabilities.filter((vulnerability) => vulnerability.severity === 'critical' && vulnerability.patchStatus !== 'patched').length;
    const overdue = incidents.filter((incident) => incident.status !== 'Resolved' && incident.slaHours && incident.slaHours <= 2).length;
    return { critical, overdue, auditIntegrity: auditLogs.length > 0 };
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
      if (summary.critical > 0) findings.push(`${summary.critical} unresolved critical CVEs`);
      if (summary.overdue > 0) findings.push(`${summary.overdue} incident(s) past SLA`);
      const passed = findings.length === 0;
      const nextResult = { passed, summary: passed ? 'Compliance Check Passed' : 'Compliance Check Found Issues', findings };
      setResult(nextResult);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addAuditLog({ id: `AUD-${Date.now()}`, action: `DevSecOps compliance check ${passed ? 'passed' : 'found issues'}`, user: user?.fullName ?? 'Unknown', timestamp, date: new Date().toISOString().slice(0, 10), source: 'DevSecOps' });
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
            <StatCard title="SonarQube" value={`${summary.critical} critical`} subtitle="Issues" />
            <StatCard title="OWASP Scan" value={summary.critical > 0 ? 'Failed' : 'Passed'} subtitle="Status" />
            <StatCard title="Risk Score" value={`${Math.round(vulnerabilities.reduce((sum, vulnerability) => sum + vulnerability.riskScore, 0) / Math.max(vulnerabilities.length, 1))}`} subtitle="Average" />
          </Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Security Review Log</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Last review date: {latestReview?.timestamp ?? 'Pending'}</Typography>
              <Typography variant="body2" color="text.secondary">Findings: {latestReview?.findings ?? 0} findings</Typography>
              <Typography variant="body2" color="text.secondary">Audit log integrity: {summary.auditIntegrity ? 'Verified' : 'Pending'}</Typography>
              <Chip label={`Approval Status: ${latestReview?.approved ? 'Approved' : 'Pending'}`} color={latestReview?.approved ? 'success' : 'warning'} />
            </Stack>
          </Paper>
          <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }} onClick={runCheck} disabled={runningCheck || !canReview}>
            {runningCheck ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {runningCheck ? 'Running compliance check...' : 'Compliance Check'}
          </Button>
          {result ? (
            <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: result.passed ? 'rgba(46, 125, 50, 0.12)' : 'rgba(237, 108, 2, 0.14)', borderRadius: 3 }}>
              <Typography variant="subtitle2" color={result.passed ? 'success.main' : 'warning.main'}>{result.summary}</Typography>
              {result.findings.map((finding) => <Typography key={finding} variant="body2" color="text.secondary">• {finding}</Typography>)}
            </Paper>
          ) : null}
          <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Security Reviews</Typography>
            {reviewHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No DevSecOps reviews have been recorded yet.</Typography>
            ) : (
              reviewHistory.map((entry) => (
                <Box key={entry.id} sx={{ mb: 1, p: 1, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">{entry.timestamp} • {entry.action}</Typography>
                  <Typography variant="caption" color="text.secondary">Findings: {entry.findings} • {entry.approved ? 'Approved' : 'Needs Attention'}</Typography>
                </Box>
              ))
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
