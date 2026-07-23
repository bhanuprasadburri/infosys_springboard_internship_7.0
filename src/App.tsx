import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import { createAppTheme } from './theme';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import { AppStateProvider } from './context/AppStateContext';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Incidents from './pages/Incidents';
import Vulnerabilities from './pages/Vulnerabilities';
import Audit from './pages/Audit';
import Compliance from './pages/Compliance';
import DevSecOps from './pages/DevSecOps';
import ForgotPassword from './pages/ForgotPassword';
import AuthChoice from './pages/AuthChoice';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import UserSignUp from './pages/UserSignUp';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const { isAuthenticated, authMode, themeMode } = useAuth();
  const theme = useMemo(() => createAppTheme(themeMode ?? 'light'), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated && authMode === 'admin' ? (
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/user/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/user/signup" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/devsecops" element={<DevSecOps />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<AuthChoice />} />
          <Route path="/login" element={<AuthChoice />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/auth/choice" element={<AuthChoice />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/devsecops" element={<DevSecOps />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;
