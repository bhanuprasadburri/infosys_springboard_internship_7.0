import { Box, Button, Chip, CircularProgress, Drawer, Menu, MenuItem, Paper, Snackbar, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';

export default function Compliance() {
  const { incidents, vulnerabilities, auditLogs, addAuditLog } = useAppState();
  const { user } = useAuth();
  const canExport = canPerformAction(user, 'export');
  const canView = canPerformAction(user, 'view');
  const [reportDrawer, setReportDrawer] = useState<string | null>(null);
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

  const compliancePercent = useMemo(() => {
    const frameworks = complianceChecklist.length;
    const compliant = complianceChecklist.filter((c) => c.status === 'Compliant').length;
    return Math.round((compliant / frameworks) * 100);
  }, [complianceChecklist]);

  const reportSummary = useMemo(() => ({
    criticalCves: vulnerabilities.filter((vulnerability) => vulnerability.severity === 'critical' && vulnerability.patchStatus !== 'patched').length,
    overdueIncidents: incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Closed' && incident.slaHours && incident.slaHours <= 2).length,
    auditCoverage: auditLogs.length,
  }), [incidents, vulnerabilities, auditLogs]);

  const accessStats = useMemo(() => ({
    totalLogins: Math.max(50, auditLogs.filter((entry) => entry.action.includes('Login')).length * 20),
    failedLogins: Math.max(0, reportSummary.overdueIncidents * 2),
    uniqueUsers: Math.min(128, auditLogs.length),
    flaggedAttempts: Math.max(0, reportSummary.criticalCves),
  }), [auditLogs, reportSummary]);

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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.secondary', color: 'text.primary' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Compliance Reporting & DevSecOps</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Compliance" value={`${compliancePercent}%`} subtitle="Frameworks aligned" />
            <StatCard title="Violations" value={reportSummary.criticalCves.toString()} subtitle="Unpatched critical CVEs" />
          </Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 700 }}>Framework Checklist</Typography>
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
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5, color: 'text.primary', fontWeight: 700 }}>Report Generation</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="outlined" onClick={() => setReportDrawer('Access Report')} disabled={!canView}>Access Report</Button>
              <Button variant="outlined" onClick={() => setReportDrawer('Security Report')} disabled={!canView}>Security Report</Button>
              <Button variant="contained" onClick={(event) => setMenuAnchor(event.currentTarget)} disabled={exporting || !canExport}>
                {exporting ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
                Export Report
              </Button>
            </Stack>
          </Paper>
          {history.length > 0 && (
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Export History</Typography>
              <Stack spacing={1}>
                {history.map((entry) => (
                  <Box key={entry.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2">{entry.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{entry.timestamp} • {entry.format}</Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>
      </Box>
      <Drawer anchor="right" open={Boolean(reportDrawer)} onClose={() => setReportDrawer(null)}>
        <Box sx={{ width: { xs: '100vw', sm: 420 }, p: 3 }}>
          {reportDrawer && (
            <Stack spacing={2}>
              <Typography variant="h6">{reportDrawer}</Typography>
              {reportDrawer === 'Access Report' ? (
                <>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Total logins:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{accessStats.totalLogins}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Failed logins:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: accessStats.failedLogins > 0 ? 'error.main' : 'text.primary' }}>{accessStats.failedLogins}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Unique users:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{accessStats.uniqueUsers}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Flagged attempts:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: accessStats.flaggedAttempts > 0 ? 'warning.main' : 'text.primary' }}>{accessStats.flaggedAttempts}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Date range:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Last 30 days</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                  <Button variant="outlined" onClick={() => {
                    addAuditLog({ id: `AUD-${Date.now()}`, action: 'Downloaded Access Report', user: user?.fullName ?? 'Unknown', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().slice(0, 10), source: 'Compliance' });
                    setReportDrawer(null);
                    setToast({ open: true, message: '✅ Access Report downloaded' });
                  }}>Download Report</Button>
                </>
              ) : (
                <>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Open incidents:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{incidents.filter((incident) => incident.status !== 'Resolved' && incident.status !== 'Closed').length}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Critical CVEs:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: reportSummary.criticalCves > 0 ? 'error.main' : 'text.primary' }}>{reportSummary.criticalCves}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Average risk score:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{(vulnerabilities.reduce((sum, vulnerability) => sum + vulnerability.riskScore, 0) / Math.max(vulnerabilities.length, 1)).toFixed(1)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Audit coverage:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: reportSummary.auditCoverage > 0 ? 'success.main' : 'text.primary' }}>
                          {reportSummary.auditCoverage > 0 ? 'Complete' : 'Pending'} ({reportSummary.auditCoverage} entries)
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                  <Button variant="outlined" onClick={() => {
                    addAuditLog({ id: `AUD-${Date.now()}`, action: 'Downloaded Security Report', user: user?.fullName ?? 'Unknown', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().slice(0, 10), source: 'Compliance' });
                    setReportDrawer(null);
                    setToast({ open: true, message: '✅ Security Report downloaded' });
                  }}>Download Report</Button>
                </>
              )}
            </Stack>
          )}
        </Box>
      </Drawer>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => handleExport('PDF')}>Export as PDF</MenuItem>
        <MenuItem onClick={() => handleExport('CSV')}>Export as CSV</MenuItem>
      </Menu>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
