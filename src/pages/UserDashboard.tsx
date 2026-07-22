import { DashboardRounded, LogoutRounded, PersonRounded } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { clearSession, readSession } from '../utils/authUtils';

export default function UserDashboard() {
  const navigate = useNavigate();
  const session = readSession();

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  if (!session || session.mode !== 'user') {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'radial-gradient(circle at top, #172554 0%, #050b13 70%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ maxWidth: 1200, mx: 'auto', borderRadius: 4, p: { xs: 3, md: 4 }, bgcolor: 'rgba(15,23,34,0.88)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2} sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f5f7fa' }}>User Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">Your personal secure operations workspace.</Typography>
          </Box>
          <Button variant="outlined" color="inherit" startIcon={<LogoutRounded />} onClick={handleLogout} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#f5f7fa' }}>
            Logout
          </Button>
        </Stack>

        <Stack spacing={3}>
          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Box sx={{ p: 1.2, borderRadius: '50%', bgcolor: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                  <PersonRounded />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ color: '#f5f7fa' }}>Welcome back, {session.user.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">Your dashboard is ready and your session is protected.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
            <Card sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CardContent>
                <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1 }}>
                  <DashboardRounded color="primary" />
                  <Typography variant="h6" sx={{ color: '#f5f7fa' }}>Overview</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">Track recent activity and stay up to date with your assigned security operations.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1 }}>Session Status</Typography>
                <Typography variant="body2" color="text.secondary">Secure session is active and protected through browser storage.</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
