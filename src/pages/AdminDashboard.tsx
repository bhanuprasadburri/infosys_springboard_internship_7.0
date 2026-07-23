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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.secondary', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ maxWidth: 1200, mx: 'auto', borderRadius: 4, p: { xs: 3, md: 4 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 12px 32px rgba(15,23,42,0.06)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">Protected administrator workspace.</Typography>
          </Box>
          <Button variant="outlined" startIcon={<LogoutRounded />} onClick={handleLogout} sx={{ borderColor: 'divider', color: 'text.primary' }}>
            Logout
          </Button>
        </Stack>

        <Stack spacing={3}>
          <Card sx={{ bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Box sx={{ p: 1.2, borderRadius: '50%', bgcolor: '#FEE2E2', color: '#EF4444' }}>
                  <ShieldRounded />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>Welcome, {session.user.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">You currently have administrator-level access to the secure operations console.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
            <Card sx={{ flex: 1, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                  <DashboardRounded color="primary" />
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>Secure Operations</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Monitor incidents, audit actions, and compliance posture from a protected command center.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>Access Policy</Typography>
                <Typography variant="body2" color="text.secondary">Administrative routes are protected and limited to the designated privileged account only.</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
