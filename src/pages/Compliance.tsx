import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import { mockComplianceReports, mockPolicies, mockReports } from '../data/mockAssets';

export default function Compliance() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Compliance Reporting & DevSecOps</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Compliance" value="100% PCI DSS" subtitle="Framework" />
            <StatCard title="Violations" value="0" subtitle="This month" />
          </Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Framework Checklist</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {mockComplianceReports.map((item) => <Chip key={item.framework} label={`${item.framework} ✓`} color="success" />)}
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
              {mockReports.map((report) => <Button key={report.id} variant="outlined">{report.name}</Button>)}
              <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>Export Report</Button>
            </Stack>
            <Stack spacing={1} sx={{ mt: 2 }}>
              {mockPolicies.map((policy) => <Typography key={policy.id} variant="body2" color="text.secondary">{policy.name} • {policy.owner} • {policy.status}</Typography>)}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
