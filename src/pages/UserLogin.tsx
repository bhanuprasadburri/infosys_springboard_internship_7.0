import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createSession, isValidEmail, sanitizeInput } from '../utils/authUtils';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanPassword = password.trim();

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    const storedUsers = localStorage.getItem('sentinelcore-users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    const user = users.find((entry: { email: string; password: string }) => entry.email === cleanEmail && entry.password === cleanPassword);

    if (!user) {
      setError('Invalid email or password.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    createSession({ id: user.id, fullName: user.fullName, email: user.email, role: 'Viewer' }, 'user-token', 'user');
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'radial-gradient(circle at top, #172554 0%, #050b13 60%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(15, 23, 34, 0.86)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 45px rgba(0,0,0,0.3)' }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#f5f7fa' }}>User Login</Typography>
            <Typography variant="body2" color="text.secondary">Access your security operations workspace.</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.2}>
              <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" fullWidth required />
              <TextField label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" fullWidth required InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((value) => !value)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={() => setRememberMe((value) => !value)} />} label="Remember me" />
                <Link component={RouterLink} to="/forgot-password" underline="hover">Forgot password?</Link>
              </Box>
              {error ? <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert> : null}
              <Button type="submit" variant="contained" disabled={!canSubmit || loading} sx={{ py: 1.2, fontWeight: 700, bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Need an account? <Link component={RouterLink} to="/signup" underline="hover">Create one</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
