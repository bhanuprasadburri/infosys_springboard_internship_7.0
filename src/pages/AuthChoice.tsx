import { AdminPanelSettingsRounded, DarkModeRounded, LightModeRounded, PersonRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AuthChoice() {
  const { toggleTheme, themeMode } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.secondary', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 760, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 16px 40px rgba(15,23,42,0.08)' }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>Choose Account Type</Typography>
              <Typography variant="body2" color="text.secondary">Select the authentication experience you need.</Typography>
            </Box>
            <IconButton onClick={toggleTheme} color="primary" sx={{ border: '1px solid', borderColor: 'divider' }}>
              {themeMode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5}>
            <Paper sx={{ flex: 1, p: 3, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={2}>
                <AdminPanelSettingsRounded sx={{ fontSize: 34, color: '#EF4444' }} />
                <Typography variant="h6" sx={{ color: 'text.primary' }}>Admin</Typography>
                <Typography variant="body2" color="text.secondary">Secure administrative access with protected routing and a private dashboard.</Typography>
                <Button component={RouterLink} to="/admin/login" variant="contained" color="error">Admin Login</Button>
              </Stack>
            </Paper>
            <Paper sx={{ flex: 1, p: 3, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={2}>
                <PersonRounded sx={{ fontSize: 34, color: '#3B82F6' }} />
                <Typography variant="h6" sx={{ color: 'text.primary' }}>User</Typography>
                <Typography variant="body2" color="text.secondary">Register or sign in as a standard user and continue into your dashboard.</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Button component={RouterLink} to="/user/login" variant="contained" color="primary">User Login</Button>
                  <Button component={RouterLink} to="/user/signup" variant="outlined">Sign Up</Button>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
