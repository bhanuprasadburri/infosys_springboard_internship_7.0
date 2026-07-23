import { Box, Button, Paper, Stack, TextField, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
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
    const result = await signup(fullName, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Unable to create account.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.secondary', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 500, p: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 4, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 700 }}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join SentinelCore SecureOps as a security operator.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth required />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
            <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth required />
            {error ? <Typography color="error">{error}</Typography> : null}
            <Button type="submit" variant="contained">
              Create Account
            </Button>
            <Typography variant="body2" color="text.secondary">
              Already have an account? <Link component={RouterLink} to="/login" sx={{ color: 'primary.main' }}>Sign in</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
