import { AppBar, Box, Chip, Toolbar, Typography } from '@mui/material';

export default function TopBar() {
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#8b1e1e', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
            SentinelCore SecureOps
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.86 }}>
            Enterprise Security Operations Platform
          </Typography>
        </Box>
        <Chip label="Milestone 1 • Infrastructure Monitoring" sx={{ bgcolor: 'rgba(255,255,255,0.16)', color: 'white' }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Security Admin • Logout
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
