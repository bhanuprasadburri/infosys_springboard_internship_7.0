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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const ok = login(email, password);
    if (ok) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#050b13', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
        <Typography variant="h4" sx={{ color: '#f5f7fa', mb: 1 }}>
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
              <Link component={RouterLink} to="/forgot-password" underline="hover">Forgot password?</Link>
            </Box>
            {error ? <Typography color="error">{error}</Typography> : null}
            <Button type="submit" variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>
              Sign In
            </Button>
            <Typography variant="body2" color="text.secondary">
              New user? <Link component={RouterLink} to="/signup">Create an account</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
