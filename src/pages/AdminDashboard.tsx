import { DashboardRounded, LogoutRounded, ShieldRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { clearSession, readSession } from '../utils/authUtils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = readSession();

  const handleLogout = () => {
    clearSession();
    navigate('/admin/login', { replace: true });
  };

  if (!session || session.mode !== 'admin') {
    navigate('/admin/login', { replace: true });
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'radial-gradient(circle at top, #0f1722 0%, #050b13 70%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ maxWidth: 1200, mx: 'auto', borderRadius: 4, p: { xs: 3, md: 4 }, bgcolor: 'rgba(15,23,34,0.88)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f5f7fa' }}>Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">Protected administrator workspace.</Typography>
          </Box>
          <Button variant="outlined" color="inherit" startIcon={<LogoutRounded />} onClick={handleLogout} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#f5f7fa' }}>
            Logout
          </Button>
        </Stack>

        <Stack spacing={3}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Box sx={{ p: 1.2, borderRadius: '50%', bgcolor: 'rgba(198,40,40,0.15)', color: '#f87171' }}>
                  <ShieldRounded />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#f5f7fa' }}>Welcome, {session.user.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">You currently have administrator-level access to the secure operations console.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
            <Card sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CardContent>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                  <DashboardRounded color="primary" />
                  <Typography variant="h6" sx={{ color: '#f5f7fa' }}>Secure Operations</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Monitor incidents, audit actions, and compliance posture from a protected command center.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1 }}>Access Policy</Typography>
                <Typography variant="body2" color="text.secondary">Administrative routes are protected and limited to the designated privileged account only.</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
