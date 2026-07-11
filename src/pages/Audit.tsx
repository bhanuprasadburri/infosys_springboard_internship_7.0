import { Box, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { mockAuditLogs } from '../data/mockAssets';
import type { AuditLog } from '../types';
import { TableCell } from '@mui/material';

export default function Audit() {
  const [actionFilter, setActionFilter] = useState('all');
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Audit Log Integrity</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Audit Logs" value="24.7M" subtitle="Entries" />
            <StatCard title="Retention" value="7 years" subtitle="Compliance" />
            <StatCard title="Encrypted" value="100%" subtitle="At rest" />
          </Box>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Action" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} size="small" sx={{ minWidth: 180 }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Login Granted">Login Granted</MenuItem>
                <MenuItem value="Policy Updated">Policy Updated</MenuItem>
                <MenuItem value="Export Report">Export Report</MenuItem>
              </TextField>
            </Stack>
          </Paper>
          <DataTable<AuditLog>
            title="Audit entries"
            columns={['Log ID', 'Action', 'User', 'Timestamp', 'IP / Source']}
            rows={mockAuditLogs.filter((entry) => actionFilter === 'all' || entry.action === actionFilter)}
            renderRow={(entry) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.id}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.action}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.user}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.timestamp}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.source}</TableCell>
              </>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
