import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitted' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setStatus('error');
      setMessage('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('submitted');
    setMessage('Reset link sent. Check your inbox.');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#050b13', p: 3 }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 440, p: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
        <Typography variant="h4" sx={{ color: '#f5f7fa', mb: 1 }}>
          Forgot password?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email and we'll send a reset link.
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
            {message ? <Typography color={status === 'error' ? 'error' : 'success.main'}>{message}</Typography> : null}
            <Button type="submit" variant="contained" sx={{ bgcolor: '#c62828', '&:hover': { bgcolor: '#8b1e1e' } }}>
              Send Reset Link
            </Button>
            <Typography variant="body2" color="text.secondary">
              Remembered your password? <RouterLink to="/login" style={{ color: '#fff', textDecoration: 'underline' }}>Sign in</RouterLink>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
