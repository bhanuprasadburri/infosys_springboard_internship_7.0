import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { mockPolicies, mockReports } from '../data/mockAssets';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';

export default function Compliance() {
  const { incidents, vulnerabilities, auditLogs, addAuditLog } = useAppState();
  const { user } = useAuth();
  const canExport = canPerformAction(user, 'export');
  const canView = canPerformAction(user, 'view');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [history, setHistory] = useState<{ id: number; name: string; format: string; timestamp: string }[]>([]);

  const frameworkStatus = useMemo(() => {
    const unresolvedCritical = vulnerabilities.filter((vulnerability) => vulnerability.severity === 'critical' && vulnerability.patchStatus !== 'patched').length;
    const overdue = incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Closed' && incident.slaHours && incident.slaHours <= 2).length;
    return {
      pci: unresolvedCritical > 0 || overdue > 0 ? 'warning' : 'success',
      soc2: overdue > 0 ? 'warning' : 'success',
      iso: unresolvedCritical > 0 ? 'warning' : 'success',
    };
  }, [incidents, vulnerabilities]);

  const complianceChecklist = useMemo(() => [
    { framework: 'PCI DSS', status: frameworkStatus.pci === 'warning' ? 'Review' : 'Compliant' },
    { framework: 'SOC 2', status: frameworkStatus.soc2 === 'warning' ? 'Review' : 'Compliant' },
    { framework: 'ISO 27001', status: frameworkStatus.iso === 'warning' ? 'Review' : 'Compliant' },
  ], [frameworkStatus]);

  const reportSummary = useMemo(() => ({
    criticalCves: vulnerabilities.filter((vulnerability) => vulnerability.severity === 'critical' && vulnerability.patchStatus !== 'patched').length,
    overdueIncidents: incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Closed' && incident.slaHours && incident.slaHours <= 2).length,
    auditCoverage: auditLogs.length,
  }), [incidents, vulnerabilities, auditLogs]);

  const handleExport = (format: string) => {
    if (!canExport) {
      setToast({ open: true, message: 'Permission denied: export is restricted for your role.' });
      setMenuAnchor(null);
      return;
    }
    setExporting(true);
    window.setTimeout(() => {
      setExporting(false);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addAuditLog({ id: `AUD-${Date.now()}`, action: `Exported compliance report (${format})`, user: user?.fullName ?? 'Unknown', timestamp, date: new Date().toISOString().slice(0, 10), source: 'Compliance' });
      setHistory((prev) => [...prev, { id: Date.now(), name: 'Compliance Report', format, timestamp }]);
      setToast({ open: true, message: `✅ Compliance report exported as ${format} — compliance-report.${format.toLowerCase()}` });
      setMenuAnchor(null);
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Compliance Reporting & DevSecOps</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Compliance" value={`${vulnerabilities.filter((v) => v.severity === 'critical' && v.patchStatus !== 'patched').length} critical gaps`} subtitle="Framework" />
            <StatCard title="Violations" value={incidents.filter((incident) => incident.status !== 'Resolved').length.toString()} subtitle="This month" />
          </Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Framework Checklist</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {complianceChecklist.map((item) => (
                <Chip
                  key={item.framework}
                  label={`${item.framework}: ${item.status}`}
                  color={item.status === 'Compliant' ? 'success' : 'warning'}
                />
              ))}
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Access Tracking Summary</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Total logins: 1,284</Typography>
              <Typography variant="body2" color="text.secondary">Failed logins: 3</Typography>
              <Typography variant="body2" color="text.secondary">Violations: 0</Typography>
            </Stack>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Report Generation</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              {mockReports.map((report) => <Button key={report.id} variant="outlined" onClick={() => setSelectedReport(report.name)} disabled={!canView}>{report.name}</Button>)}
              <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }} onClick={(event) => setMenuAnchor(event.currentTarget)} disabled={exporting || !canExport}>
                {exporting ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                Export Report
              </Button>
            </Stack>
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Typography variant="body2" color={reportSummary.criticalCves > 0 ? 'warning.main' : 'success.main'}>Critical CVEs pending: {reportSummary.criticalCves}</Typography>
              <Typography variant="body2" color={reportSummary.overdueIncidents > 0 ? 'warning.main' : 'success.main'}>Open SLA breaches: {reportSummary.overdueIncidents}</Typography>
              <Typography variant="body2" color="text.secondary">Audit coverage: {reportSummary.auditCoverage} entries</Typography>
            </Stack>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {mockPolicies.map((policy) => <Typography key={policy.id} variant="body2" color="text.secondary">{policy.name} • {policy.owner} • {policy.status}</Typography>)}
            </Stack>
            {history.length > 0 && <Stack spacing={1} sx={{ mt: 2 }}><Typography variant="subtitle2">Export History</Typography>{history.map((entry) => <Typography key={entry.id} variant="body2" color="text.secondary">{entry.name} • {entry.format} • {entry.timestamp}</Typography>)}</Stack>}
          </Paper>
        </Box>
      </Box>
      <Dialog open={Boolean(selectedReport)} onClose={() => setSelectedReport(null)}>
        <DialogTitle>{selectedReport ?? 'Report'}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {selectedReport === 'Access Report' ? (
              <>
                <Typography color="text.secondary">Total logins: 1,284</Typography>
                <Typography color="text.secondary">Failed logins: 3</Typography>
                <Typography color="text.secondary">Unique users: 128</Typography>
                <Typography color="text.secondary">Flagged attempts: 2</Typography>
                <Typography color="text.secondary">Date range: Last 30 days</Typography>
              </>
            ) : (
              <>
                <Typography color="text.secondary">Open incidents: {incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Closed').length}</Typography>
                <Typography color="text.secondary">Critical CVEs: {reportSummary.criticalCves}</Typography>
                <Typography color="text.secondary">Average risk score: {(vulnerabilities.reduce((sum, vulnerability) => sum + vulnerability.riskScore, 0) / Math.max(vulnerabilities.length, 1)).toFixed(1)}</Typography>
                <Typography color="text.secondary">Audit coverage: {reportSummary.auditCoverage > 0 ? 'Complete' : 'Pending'}</Typography>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedReport(null)}>Close</Button>
          <Button variant="contained" onClick={() => {
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            addAuditLog({ id: `AUD-${Date.now()}`, action: `Downloaded ${selectedReport ?? 'report'}`, user: user?.fullName ?? 'Unknown', timestamp, date: new Date().toISOString().slice(0, 10), source: 'Compliance' });
            setSelectedReport(null);
            setToast({ open: true, message: `✅ ${selectedReport ?? 'Report'} downloaded` });
          }}>Download</Button>
        </DialogActions>
      </Dialog>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => handleExport('PDF')}>Export as PDF</MenuItem>
        <MenuItem onClick={() => handleExport('CSV')}>Export as CSV</MenuItem>
      </Menu>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
