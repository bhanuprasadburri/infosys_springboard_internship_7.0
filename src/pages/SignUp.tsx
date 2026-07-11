import { Box, Button, MenuItem, Paper, Stack, TextField, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Security Admin' | 'Auditor' | 'Viewer'>('Security Admin');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const ok = signup(fullName, email, password, role);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Unable to create account.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#050b13', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 500, p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
        <Typography variant="h4" sx={{ color: '#f5f7fa', mb: 1 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join SentinelCore SecureOps as a security operator.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth required />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            <TextField select label="Role" value={role} onChange={(e) => setRole(e.target.value as 'Security Admin' | 'Auditor' | 'Viewer')} fullWidth>
              <MenuItem value="Security Admin">Security Admin</MenuItem>
              <MenuItem value="Auditor">Auditor</MenuItem>
              <MenuItem value="Viewer">Viewer</MenuItem>
            </TextField>
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
            <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required />
            {error ? <Typography color="error">{error}</Typography> : null}
            <Button type="submit" variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>
              Create Account
            </Button>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <Link component={RouterLink} to="/login">Sign in</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
