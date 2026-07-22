import { AdminPanelSettingsRounded, PersonRounded } from '@mui/icons-material';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AuthChoice() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'radial-gradient(circle at top, #1f2937 0%, #050b13 70%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 760, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(15,23,34,0.86)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)' }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f5f7fa' }}>Choose Account Type</Typography>
            <Typography variant="body2" color="text.secondary">Select the authentication experience you need.</Typography>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
            <Paper sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack spacing={2}>
                <AdminPanelSettingsRounded sx={{ fontSize: 34, color: '#f87171' }} />
                <Typography variant="h6" sx={{ color: '#f5f7fa' }}>Admin</Typography>
                <Typography variant="body2" color="text.secondary">Secure administrative access with protected routing and a private dashboard.</Typography>
                <Button component={RouterLink} to="/admin/login" variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>Admin Login</Button>
              </Stack>
            </Paper>
            <Paper sx={{ flex: 1, p: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Stack spacing={2}>
                <PersonRounded sx={{ fontSize: 34, color: '#60a5fa' }} />
                <Typography variant="h6" sx={{ color: '#f5f7fa' }}>User</Typography>
                <Typography variant="body2" color="text.secondary">Register or sign in as a standard user and continue into your dashboard.</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button component={RouterLink} to="/user/login" variant="contained" sx={{ bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>User Login</Button>
                  <Button component={RouterLink} to="/user/signup" variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.2)', color: '#f5f7fa' }}>Sign Up</Button>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
