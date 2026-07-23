import { Box, Button, Paper, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.secondary', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 480, p: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4, textAlign: 'center', boxShadow: '0 12px 32px rgba(15,23,42,0.06)' }}>
        <Typography variant="h2" sx={{ color: 'primary.main', mb: 2, fontWeight: 700 }}>404</Typography>
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1, fontWeight: 700 }}>Page not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
