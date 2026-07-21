import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, MenuItem, Pagination, Paper, Snackbar, Stack, TableCell, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';
import type { Vulnerability, AlertSeverity, VulnerabilityStatus } from '../types';

export default function Vulnerabilities() {
  const { vulnerabilities, updateVulnerability, addAuditLog } = useAppState();
  const { user } = useAuth();
  const canPatch = canPerformAction(user, 'patch');
  const canView = canPerformAction(user, 'view');
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);
  const [patchTarget, setPatchTarget] = useState<Vulnerability | null>(null);
  const [patching, setPatching] = useState(false);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | AlertSeverity>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | VulnerabilityStatus>('all');
  const [sortField, setSortField] = useState<'riskScore' | 'cvss' | 'severity' | 'patchStatus'>('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  const summary = useMemo(() => {
    const patched = vulnerabilities.filter((vulnerability) => vulnerability.patchStatus === 'patched').length;
    const pending = vulnerabilities.filter((vulnerability) => vulnerability.patchStatus === 'pending').length;
    const riskScore = vulnerabilities.reduce((total, vulnerability) => total + vulnerability.riskScore, 0) / Math.max(vulnerabilities.length, 1);
    return { patched, pending, riskScore: riskScore.toFixed(1) };
  }, [vulnerabilities]);

  const filteredVulnerabilities = useMemo(() => {
    return vulnerabilities.filter((vulnerability) => {
      const matchesSearch = search === '' || vulnerability.cveId.toLowerCase().includes(search.toLowerCase()) || vulnerability.affectedAssetNames?.some((asset) => asset.toLowerCase().includes(search.toLowerCase()));
      const matchesSeverity = severityFilter === 'all' || vulnerability.severity === severityFilter;
      const matchesStatus = statusFilter === 'all' || vulnerability.patchStatus === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [vulnerabilities, search, severityFilter, statusFilter]);

  const sortedVulnerabilities = useMemo(() => {
    return [...filteredVulnerabilities].sort((a, b) => {
      if (sortField === 'severity') {
        const severityRank = { critical: 3, high: 2, medium: 1, low: 0 } as const;
        return sortDirection === 'asc' ? severityRank[a.severity] - severityRank[b.severity] : severityRank[b.severity] - severityRank[a.severity];
      }
      if (sortField === 'patchStatus') {
        const statusRank = { available: 0, tested: 1, pending: 2, patched: 3 } as const;
        return sortDirection === 'asc' ? statusRank[a.patchStatus] - statusRank[b.patchStatus] : statusRank[b.patchStatus] - statusRank[a.patchStatus];
      }
      return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    });
  }, [filteredVulnerabilities, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedVulnerabilities.length / pageSize));
  const pagedVulnerabilities = useMemo(() => {
    const nextPage = Math.min(page, pageCount);
    if (nextPage !== page) setPage(nextPage);
    return sortedVulnerabilities.slice((nextPage - 1) * pageSize, nextPage * pageSize);
  }, [page, pageCount, sortedVulnerabilities]);

  const handlePatch = (vulnerability: Vulnerability) => {
    if (!canPatch) return;
    setPatchTarget(vulnerability);
  };

  const confirmPatch = () => {
    if (!patchTarget) return;
    setPatching(true);
    window.setTimeout(() => {
      const shouldFail = Math.random() < 0.1;
      if (shouldFail) {
        setPatching(false);
        setPatchTarget(null);
        setToast({ open: true, message: '❌ Patch failed — rollback initiated, retry?' });
        return;
      }

      const newRisk = Math.max(1, Math.round((patchTarget.riskScore - 40) * 10) / 10);
      updateVulnerability(patchTarget.id, (current) => ({
        ...current,
        patchStatus: 'patched',
        previousRiskScore: current.riskScore,
        riskScore: newRisk,
        activityLog: [...(current.activityLog ?? []), `✅ Patched at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Risk reduced to ${newRisk}`],
      }));
      const auditDate = new Date().toISOString().slice(0, 10);
      addAuditLog({ id: `AUD-${Date.now()}`, action: `Patched ${patchTarget.cveId}`, user: user?.fullName ?? 'Unknown', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: auditDate, source: 'Vulnerabilities' });
      setPatching(false);
      setPatchTarget(null);
      setToast({ open: true, message: `✅ ${patchTarget.cveId} patched successfully — ${patchTarget.affectedAssets} assets updated` });
    }, 1500);
  };

  const openReport = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Risk Assessment & Patching</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Vulnerabilities Tracked" value={vulnerabilities.length.toString()} subtitle="Current" />
            <StatCard title="Critical Patched" value={summary.patched.toString()} subtitle="This quarter" />
            <StatCard title="Risk Score" value={summary.riskScore} subtitle="Average" />
          </Box>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField label="Search CVE / asset" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 200 }} />
              <TextField select label="Severity" value={severityFilter} onChange={(e) => { setSeverityFilter(e.target.value as 'all' | AlertSeverity); setPage(1); }} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="all">All severities</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </TextField>
              <TextField select label="Patch status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as 'all' | VulnerabilityStatus); setPage(1); }} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="all">All statuses</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="tested">Tested</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="patched">Patched</MenuItem>
              </TextField>
              <TextField select label="Sort by" value={sortField} onChange={(e) => setSortField(e.target.value as 'riskScore' | 'cvss' | 'severity' | 'patchStatus')} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="riskScore">Risk score</MenuItem>
                <MenuItem value="cvss">CVSS</MenuItem>
                <MenuItem value="severity">Severity</MenuItem>
                <MenuItem value="patchStatus">Patch status</MenuItem>
              </TextField>
              <TextField select label="Direction" value={sortDirection} onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </TextField>
            </Stack>
          </Paper>
          <DataTable<Vulnerability>
            title="Known CVEs"
            columns={['CVE', 'Severity', 'CVSS', 'Affected Assets', 'Patch Status', 'Risk Score', 'Last Scan', 'Action']}
            rows={pagedVulnerabilities}
            emptyText="No vulnerabilities match your filters"
            renderRow={(vulnerability) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.cveId}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={vulnerability.severity} color={vulnerability.severity === 'critical' ? 'error' : vulnerability.severity === 'high' ? 'warning' : 'success'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.cvss}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.affectedAssets}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.patchStatus}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.riskScore}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.lastScanSource}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Stack direction="row" spacing={1}>{vulnerability.patchStatus === 'patched' ? <Chip label="Patched ✓" color="success" size="small" /> : <Button size="small" variant="outlined" onClick={() => handlePatch(vulnerability)} disabled={!canPatch}>{patching && patchTarget?.id === vulnerability.id ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}Patch Now</Button>}<Button size="small" variant="outlined" onClick={() => openReport(vulnerability)} disabled={!canView}>Risk Report</Button></Stack></TableCell>
              </>
            )}
            footer={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#98a7b7' }}>
                  Showing {pagedVulnerabilities.length} of {sortedVulnerabilities.length} matching vulnerabilities
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField select label="Page size" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} size="small" sx={{ width: 130 }}>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                  </TextField>
                  <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="secondary" />
                </Stack>
              </Box>
            }
          />
        </Box>
      </Box>
      <Dialog open={Boolean(patchTarget)} onClose={() => !patching && setPatchTarget(null)}>
        <DialogTitle>Patch CVE — {patchTarget?.cveId}</DialogTitle>
        <DialogContent>
          {patchTarget && (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              <Typography color="text.secondary">Affected assets: {patchTarget.affectedAssets}</Typography>
              <Typography color="text.secondary">Current risk score: {patchTarget.riskScore}</Typography>
              <Typography color="text.secondary">Patch availability: {patchTarget.patchStatus === 'available' ? 'Available' : 'Pending review'}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPatchTarget(null)} disabled={patching}>Cancel</Button>
          <Button variant="contained" onClick={confirmPatch} disabled={patching}>
            {patching ? <CircularProgress size={16} sx={{ mr: 1 }} /> : null}
            {patching ? 'Patching...' : 'Confirm Patch'}
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer anchor="right" open={Boolean(selectedVulnerability)} onClose={() => setSelectedVulnerability(null)}>
        <Box sx={{ width: { xs: '100vw', sm: 420 }, p: 3 }}>
          {selectedVulnerability && (
            <Stack spacing={2}>
              <Typography variant="h6">{selectedVulnerability.cveId}</Typography>
              <Typography color="text.secondary">CVSS: {selectedVulnerability.cvss}</Typography>
              <Typography color="text.secondary">Affected assets: {selectedVulnerability.affectedAssetNames?.join(', ') || 'N/A'}</Typography>
              <Typography color="text.secondary">Patch status: {selectedVulnerability.patchStatus}</Typography>
              <Typography color="text.secondary">Risk trend: {selectedVulnerability.previousRiskScore ?? selectedVulnerability.riskScore} → {selectedVulnerability.riskScore}</Typography>
              <Typography color="text.secondary">Last scan: {selectedVulnerability.lastScanTimestamp}</Typography>
              <Typography color="text.secondary">Scan source: {selectedVulnerability.lastScanSource}</Typography>
              <Button variant="outlined" onClick={() => { setToast({ open: true, message: `✅ Report downloaded: risk-report-${selectedVulnerability.cveId.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.pdf` }); setSelectedVulnerability(null); }}>
                Download Report
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
