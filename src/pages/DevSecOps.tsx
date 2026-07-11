import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';

export default function DevSecOps() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>DevSecOps Dashboard</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="SonarQube" value="0 critical" subtitle="Issues" />
            <StatCard title="OWASP Scan" value="Passed" subtitle="Status" />
          </Box>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Security Review Log</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">Last review date: 2026-07-10</Typography>
              <Typography variant="body2" color="text.secondary">Findings: 2 medium, 1 low</Typography>
              <Chip label="Approval Status: Approved" color="success" />
            </Stack>
          </Paper>
          <Button variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>Compliance Check</Button>
        </Box>
      </Box>
    </Box>
  );
}
