import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <Typography variant="body2">{user.role} • {user.fullName}</Typography>
            <Typography variant="body2" sx={{ cursor: 'pointer', color: '#fdd0d0' }} onClick={handleLogout}>
              Logout
            </Typography>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}
