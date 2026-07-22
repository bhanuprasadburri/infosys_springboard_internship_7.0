import { Visibility, VisibilityOff, SecurityRounded } from '@mui/icons-material';
import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createSession, isValidEmail, sanitizeInput } from '../utils/authUtils';

export default function AdminLogin() {
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
      setError('Please enter a valid admin email address.');
      return;
    }

    if (!cleanPassword) {
      setError('Please enter your password.');
      return;
    }

    if (cleanEmail !== 'bhanu@gmail.com' || cleanPassword !== 'Bhanu@') {
      setError('Invalid Admin Credentials.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    const adminUser = {
      id: 'admin-1',
      fullName: 'Admin User',
      email: cleanEmail,
      role: 'Security Admin' as const,
    };

    createSession(adminUser, 'admin-token', 'admin');
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'radial-gradient(circle at top, #1f2937 0%, #050b13 60%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 460, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(15, 23, 34, 0.86)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 45px rgba(0,0,0,0.3)' }}>
        <Stack spacing={2.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ p: 1.1, borderRadius: '50%', bgcolor: 'rgba(198, 40, 40, 0.15)', color: '#f87171' }}>
              <SecurityRounded fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f5f7fa' }}>Admin Access</Typography>
              <Typography variant="body2" color="text.secondary">Secure sign in for authorized administrators.</Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2, bgcolor: 'rgba(59,130,246,0.12)', color: '#bfdbfe', border: '1px solid rgba(59,130,246,0.18)' }}>
            Only the designated administrative credentials are accepted.
          </Alert>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.2}>
              <TextField
                label="Work Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@admin.com"
                fullWidth
                required
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((value) => !value)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <FormControlLabel control={<Checkbox checked={rememberMe} onChange={() => setRememberMe((value) => !value)} />} label="Remember me" />
                <Link component={RouterLink} to="/forgot-password" underline="hover">Forgot password?</Link>
              </Box>
              {error ? <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert> : null}
              <Button type="submit" variant="contained" disabled={!canSubmit || loading} sx={{ py: 1.2, fontWeight: 700, bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In as Admin'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Need a standard account? <Link component={RouterLink} to="/login" underline="hover">User login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
