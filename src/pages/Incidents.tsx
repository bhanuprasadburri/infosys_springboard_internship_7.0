import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { mockIncidents } from '../data/mockAssets';
import type { Incident } from '../types';
import { TableCell } from '@mui/material';

export default function Incidents() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Incident Tracking & Resolution</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Active Incidents" value="23" subtitle="Live" />
            <StatCard title="MTTR" value="47 min" subtitle="Mean resolution" />
            <StatCard title="Resolved" value="2,847" subtitle="This month" />
          </Box>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>Workflow Stages</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {['Open', 'Assigned', 'Investigation', 'Resolved'].map((stage) => <Chip key={stage} label={stage} color={stage === 'Resolved' ? 'success' : stage === 'Investigation' ? 'warning' : stage === 'Assigned' ? 'info' : 'error'} />)}
            </Stack>
          </Paper>
          <DataTable<Incident>
            title="Incidents"
            columns={['ID', 'Severity', 'Type', 'Source IP', 'Status', 'Assigned Team', 'SLA/ETA', 'Action']}
            rows={mockIncidents}
            renderRow={(incident) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.id}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={incident.severity} color={incident.severity === 'critical' ? 'error' : incident.severity === 'high' ? 'warning' : 'success'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.title}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.sourceIp}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={incident.status} color={incident.status === 'Resolved' ? 'success' : incident.status === 'Assigned' ? 'warning' : 'error'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.assignedTeam}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{incident.eta}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Stack direction="row" spacing={1}><Button size="small" variant="outlined">Investigate</Button><Button size="small" variant="outlined">Assign</Button></Stack></TableCell>
              </>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
