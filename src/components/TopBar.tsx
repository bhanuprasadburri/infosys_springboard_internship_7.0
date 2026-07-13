import { AppBar, Badge, Box, Button, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useAppState } from '../context/AppStateContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const { auditLogs } = useAppState();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const recentNotifications = auditLogs.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#8b1e1e', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          SentinelCore SecureOps
        </Typography>
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ minWidth: 0, p: 0 }}>
              <Badge badgeContent={recentNotifications.length} color="secondary">
                <Typography variant="body2">Alerts</Typography>
              </Badge>
            </Button>
            <Typography variant="body2">{user.role} • {user.fullName}</Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer', color: '#fdd0d0' }} onClick={handleLogout}>
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
