import { Box, Button, Checkbox, FormControlLabel, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.secondary', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 700 }}>
          Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Access SentinelCore SecureOps monitoring workspace.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Link component={RouterLink} to="/forgot-password" underline="hover" sx={{ color: 'primary.main' }}>Forgot password?</Link>
            </Box>
            {error ? <Typography color="error">{error}</Typography> : null}
            <Button type="submit" variant="contained">
              Sign In
            </Button>
            <Typography variant="body2" color="text.secondary">
              New user? <Link component={RouterLink} to="/signup" sx={{ color: 'primary.main' }}>Create an account</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
