import { Box, Chip, MenuItem, Paper, Stack, TableCell, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { mockAssets } from '../data/mockAssets';
import type { Asset } from '../types';

export default function Assets() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredAssets = useMemo(() => mockAssets.filter((asset) => {
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || asset.environment.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  }), [search, statusFilter, typeFilter]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Asset Inventory</Typography>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Search asset" value={search} onChange={(e) => setSearch(e.target.value)} size="small" />
              <TextField select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 140 }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
              <TextField select label="Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} size="small" sx={{ minWidth: 140 }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="server">Server</MenuItem>
                <MenuItem value="cloud">Cloud</MenuItem>
                <MenuItem value="k8s-pod">K8s pod</MenuItem>
              </TextField>
            </Stack>
          </Paper>
          <DataTable<Asset>
            title="Assets"
            columns={['ID', 'Name', 'Type', 'Environment', 'Status', 'CPU%', 'Memory%', 'Disk%', 'Last checked']}
            rows={filteredAssets}
            renderRow={(asset) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.id}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.name}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.type}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.environment}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={asset.status} color={asset.status === 'critical' ? 'error' : asset.status === 'warning' ? 'warning' : 'success'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.cpu}%</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.memory}%</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.disk}%</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{asset.lastChecked}</TableCell>
              </>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
