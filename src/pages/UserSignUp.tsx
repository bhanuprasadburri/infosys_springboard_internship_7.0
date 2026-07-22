import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createSession, isStrongPassword, isValidEmail, sanitizeInput } from '../utils/authUtils';

export default function UserSignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const canSubmit = useMemo(() => fullName.trim().length > 0 && email.trim().length > 0 && password.length > 0 && confirmPassword.length > 0, [confirmPassword.length, email, fullName, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const cleanFullName = sanitizeInput(fullName);
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanFullName || !cleanEmail || !cleanPassword || !cleanConfirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isStrongPassword(cleanPassword)) {
      setError('Use at least 8 characters, including upper/lowercase letters, a number, and a symbol.');
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const storedUsers = localStorage.getItem('sentinelcore-users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    if (users.some((entry: { email: string }) => entry.email === cleanEmail)) {
      setError('An account with that email already exists.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    const newUser = { id: crypto.randomUUID(), fullName: cleanFullName, email: cleanEmail, password: cleanPassword };
    users.push(newUser);
    localStorage.setItem('sentinelcore-users', JSON.stringify(users));
    createSession({ id: newUser.id, fullName: cleanFullName, email: cleanEmail, role: 'Viewer' }, 'user-token', 'user');
    setSuccess('Account created successfully.');
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'radial-gradient(circle at top, #1e3a8a 0%, #050b13 60%)', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 520, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(15, 23, 34, 0.86)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 45px rgba(0,0,0,0.3)' }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#f5f7fa' }}>Create User Account</Typography>
            <Typography variant="body2" color="text.secondary">Register to access the user workspace.</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.2}>
              <TextField label="Full Name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Alex Morgan" fullWidth required />
              <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" fullWidth required />
              <TextField label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" fullWidth required InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword((value) => !value)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
              <TextField label="Confirm Password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="••••••••" fullWidth required InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword((value) => !value)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
              {error ? <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert> : null}
              {success ? <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert> : null}
              <Button type="submit" variant="contained" disabled={!canSubmit || loading} sx={{ py: 1.2, fontWeight: 700, bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Already registered? <Link component={RouterLink} to="/login" underline="hover">User login</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
