import { Box, MenuItem, Paper, Stack, TableCell, TextField, Typography, Pagination } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAppState } from '../context/AppStateContext';
import type { AuditLog } from '../types';

const PAGE_SIZE = 8;

export default function Audit() {
  const { auditLogs } = useAppState();
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filteredLogs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    const byAction = actionFilter === 'all' ? auditLogs : auditLogs.filter((entry) => entry.action === actionFilter);
    const now = new Date();
    const byDate = dateFilter === 'today'
      ? byAction.filter((entry) => entry.date === now.toISOString().slice(0, 10))
      : dateFilter === 'week'
        ? byAction.filter((entry) => {
            const entryDate = new Date(entry.date);
            const diff = Math.abs(now.getTime() - entryDate.getTime());
            return diff <= 7 * 24 * 60 * 60 * 1000;
          })
        : byAction;
    return byDate.filter((entry) => !search || [entry.action, entry.user, entry.source].some((value) => value.toLowerCase().includes(search)));
  }, [actionFilter, auditLogs, dateFilter, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const pagedLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
              <TextField label="Search log" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 220 }} />
              <TextField select label="Action" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 180 }}>
                <MenuItem value="all">All</MenuItem>
                {Array.from(new Set(auditLogs.map((entry) => entry.action))).map((action) => (
                  <MenuItem key={action} value={action}>{action}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Date range" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="all">All time</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 days</MenuItem>
              </TextField>
            </Stack>
          </Paper>
          <DataTable<AuditLog>
            title="Audit entries"
            columns={['Log ID', 'Action', 'User', 'Timestamp', 'IP / Source']}
            rows={pagedLogs}
            emptyText="No audit log entries match your filters"
            renderRow={(entry) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.id}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.action}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.user}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.timestamp}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{entry.source}</TableCell>
              </>
            )}
            footer={
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="secondary" />
              </Box>
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
