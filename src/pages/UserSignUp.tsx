import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Link, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { isStrongPassword, isValidEmail, sanitizeInput } from '../utils/authUtils';

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
  const [toast, setToast] = useState({ open: false, message: '' });
  const navigate = useNavigate();
  const { signup } = useAuth();

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

    setLoading(true);
    const success = await signup(cleanFullName, cleanEmail, cleanPassword);
    setLoading(false);

    if (!success) {
      setError('Unable to create account.');
      setToast({ open: true, message: 'Unable to create account.' });
      return;
    }

    setSuccess('Account created successfully.');
    setToast({ open: true, message: 'Account created successfully.' });
    navigate('/dashboard', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.secondary', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 520, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 16px 40px rgba(15,23,42,0.08)' }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>Create User Account</Typography>
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
              <Button type="submit" variant="contained" disabled={!canSubmit || loading} sx={{ py: 1.2, fontWeight: 700 }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Already registered? <Link component={RouterLink} to="/login" underline="hover">User login</Link>
          </Typography>
        </Stack>
      </Paper>
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast({ open: false, message: '' })} message={toast.message} />
    </Box>
  );
}
