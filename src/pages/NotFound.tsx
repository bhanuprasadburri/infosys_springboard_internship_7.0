import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#050b13', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 480, p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: '#f5f7fa', mb: 2 }}>404</Typography>
        <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1 }}>Page not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
