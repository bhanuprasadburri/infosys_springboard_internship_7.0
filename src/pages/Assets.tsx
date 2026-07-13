import { Box, Button, Chip, Drawer, MenuItem, Paper, Pagination, Snackbar, Stack, TableCell, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import DataTable from '../components/DataTable';
import { useAppState } from '../context/AppStateContext';
import { useAuth, canPerformAction } from '../auth/AuthContext';
import type { Asset } from '../types';

export default function Assets() {
  const location = useLocation();
  const { assets, updateAsset, addAuditLog } = useAppState();
  const { user } = useAuth();
  const canReview = canPerformAction(user, 'review');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState<'name' | 'status' | 'environment' | 'type'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status && ['healthy', 'warning', 'critical'].includes(status)) {
      setStatusFilter(status);
    }
  }, [location.search]);

  const filteredAssets = useMemo(() => assets.filter((asset) => {
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesSearch = asset.name.toLowerCase().includes(search.toLowerCase()) || asset.environment.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  }), [search, statusFilter, typeFilter, assets]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const aValue = String(a[sortField]);
      const bValue = String(b[sortField]);
      if (aValue === bValue) return 0;
      if (sortDirection === 'asc') return aValue.localeCompare(bValue, undefined, { numeric: true });
      return bValue.localeCompare(aValue, undefined, { numeric: true });
    });
  }, [filteredAssets, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedAssets.length / pageSize));
  const pagedAssets = useMemo(() => {
    const nextPage = Math.min(page, pageCount);
    if (nextPage !== page) setPage(nextPage);
    return sortedAssets.slice((nextPage - 1) * pageSize, nextPage * pageSize);
  }, [page, pageCount, sortedAssets]);

  const handleOpenAsset = (asset: Asset) => setSelectedAsset(asset);

  const handleReviewAsset = (asset: Asset) => {
    if (!canReview) {
      setToast({ open: true, message: 'Permission denied: cannot review assets.' });
      return;
    }

    updateAsset(asset.id, (current) => ({
      ...current,
      lastChecked: 'reviewed just now',
      lastReviewed: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    addAuditLog({
      id: `AUD-${Date.now()}`,
      action: `Reviewed asset ${asset.name}`,
      user: user?.fullName ?? 'Unknown',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().slice(0, 10),
      source: 'Assets',
    });

    setToast({ open: true, message: `✅ Reviewed ${asset.name}` });
    setSelectedAsset(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Asset Inventory</Typography>
          <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField label="Search asset" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 220 }} />
              <TextField select label="Status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 140 }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </TextField>
              <TextField select label="Type" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 140 }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="server">Server</MenuItem>
                <MenuItem value="cloud">Cloud</MenuItem>
                <MenuItem value="k8s-pod">K8s pod</MenuItem>
              </TextField>
              <TextField select label="Sort" value={sortField} onChange={(e) => setSortField(e.target.value as 'name' | 'status' | 'environment' | 'type')} size="small" sx={{ minWidth: 160 }}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="status">Status</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="environment">Environment</MenuItem>
              </TextField>
              <TextField select label="Direction" value={sortDirection} onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')} size="small" sx={{ minWidth: 140 }}>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </TextField>
            </Stack>
          </Paper>
          <DataTable<Asset>
            title="Assets"
            columns={['ID', 'Name', 'Type', 'Environment', 'Status', 'CPU%', 'Memory%', 'Disk%', 'Last checked', 'Action']}
            rows={pagedAssets}
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
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Stack direction="row" spacing={1}><Button size="small" variant="outlined" onClick={() => handleOpenAsset(asset)}>Details</Button><Button size="small" variant="contained" onClick={() => handleReviewAsset(asset)} disabled={!canReview}>Review</Button></Stack></TableCell>
              </>
            )}
            footer={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ color: '#98a7b7' }}>
                  Showing {pagedAssets.length} of {sortedAssets.length} matching assets
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField select label="Page size" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} size="small" sx={{ width: 120 }}>
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
      <Drawer anchor="right" open={Boolean(selectedAsset)} onClose={() => setSelectedAsset(null)}>
        <Box sx={{ width: { xs: '100vw', sm: 420 }, p: 3 }}>
          {selectedAsset && (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{selectedAsset.name}</Typography>
              <Typography variant="body2" color="text.secondary">ID: {selectedAsset.id}</Typography>
              <Typography variant="body2" color="text.secondary">Type: {selectedAsset.type}</Typography>
              <Typography variant="body2" color="text.secondary">Environment: {selectedAsset.environment}</Typography>
              <Typography variant="body2" color="text.secondary">Provider: {selectedAsset.provider}</Typography>
              <Typography variant="body2" color="text.secondary">Status: {selectedAsset.status}</Typography>
              <Typography variant="body2" color="text.secondary">Last checked: {selectedAsset.lastChecked}</Typography>
              <Typography variant="body2" color="text.secondary">Last reviewed: {selectedAsset.lastReviewed ?? 'Pending'}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleReviewAsset(selectedAsset)} disabled={!canReview}>
                Review Asset
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast((prev) => ({ ...prev, open: false }))} message={toast.message} />
    </Box>
  );
}
