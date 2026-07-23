import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import { AppBar, Badge, Box, Button, IconButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAppState } from '../context/AppStateContext';

export default function TopBar() {
  const { user, logout, toggleTheme, themeMode } = useAuth();
  const { auditLogs } = useAppState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const recentNotifications = auditLogs.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', boxShadow: '0 10px 30px rgba(15,23,42,0.05)' }}>
      <Toolbar sx={{ minHeight: { xs: 74, md: 84 }, px: { xs: 2, md: 3 }, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'primary.main', color: 'common.white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
            SC
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1 }}>
              SentinelCore SecureOps
            </Typography>
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Security operations command center
            </Typography>
          </Box>
        </Box>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ minWidth: 0, px: 1.25, py: 0.75, color: 'text.primary', borderRadius: 999, border: '1px solid', borderColor: 'divider', bgcolor: 'background.secondary' }}>
              <Badge badgeContent={recentNotifications.length} color="error">
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Alerts</Typography>
              </Badge>
            </Button>
            <Typography variant="body2" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>{user.role} • {user.fullName}</Typography>
            <IconButton onClick={toggleTheme} color="primary" size="small" sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.secondary' }}>
              {themeMode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
            </IconButton>
            <Typography variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 600, '&:hover': { color: 'primary.dark' } }} onClick={handleLogout}>
              Logout
            </Typography>
          </Box>
        ) : null}
      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {recentNotifications.length === 0 ? (
          <MenuItem disabled>No recent actions</MenuItem>
        ) : (
          recentNotifications.map((entry) => (
            <MenuItem key={entry.id} onClick={() => setAnchorEl(null)}>
              <ListItemText primary={entry.action} secondary={`${entry.user} • ${entry.timestamp}`} />
            </MenuItem>
          ))
        )}
      </Menu>
    </AppBar>
  );
}
