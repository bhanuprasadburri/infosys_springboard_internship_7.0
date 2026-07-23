import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Link, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { isValidEmail, sanitizeInput } from '../utils/authUtils';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

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

    setLoading(true);
    const success = await login(cleanEmail, cleanPassword, rememberMe);
    setLoading(false);

    if (!success) {
      setError('Invalid email or password.');
      setToast({ open: true, message: 'Invalid email or password.' });
      return;
    }

    setToast({ open: true, message: 'Welcome back.' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.secondary', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 16px 40px rgba(15,23,42,0.08)' }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>User Login</Typography>
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
              <Button type="submit" variant="contained" disabled={!canSubmit || loading} sx={{ py: 1.2, fontWeight: 700 }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Need an account? <Link component={RouterLink} to="/signup" underline="hover">Create one</Link>
          </Typography>
        </Stack>
      </Paper>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ open: false, message: '' })} message={toast.message} />
    </Box>
  );
}
