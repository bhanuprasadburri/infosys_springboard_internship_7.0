import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { mockVulnerabilities } from '../data/mockAssets';
import type { Vulnerability } from '../types';
import { TableCell } from '@mui/material';

export default function Vulnerabilities() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050b13', color: '#f5f7fa' }}>
      <TopBar />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <Sidebar />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Risk Assessment & Patching</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2, mb: 3 }}>
            <StatCard title="Vulnerabilities Tracked" value="847" subtitle="Current" />
            <StatCard title="Critical Patched" value="12" subtitle="This quarter" />
            <StatCard title="Risk Score" value="2.3" subtitle="Average" />
          </Box>
          <DataTable<Vulnerability>
            title="Known CVEs"
            columns={['CVE', 'Severity', 'CVSS', 'Affected Assets', 'Patch Status', 'Risk Score', 'Last Scan', 'Action']}
            rows={mockVulnerabilities}
            renderRow={(vulnerability) => (
              <>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.cveId}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Chip label={vulnerability.severity} color={vulnerability.severity === 'critical' ? 'error' : vulnerability.severity === 'high' ? 'warning' : 'success'} size="small" /></TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.cvss}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.affectedAssets}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.patchStatus}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.riskScore}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}>{vulnerability.lastScanSource}</TableCell>
                <TableCell sx={{ color: '#f5f7fa', borderColor: 'rgba(255,255,255,0.08)' }}><Stack direction="row" spacing={1}><Button size="small" variant="outlined">Patch Now</Button><Button size="small" variant="outlined">Report</Button></Stack></TableCell>
              </>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
