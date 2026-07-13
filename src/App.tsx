import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import { AppStateProvider } from './context/AppStateContext';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Incidents from './pages/Incidents';
import Vulnerabilities from './pages/Vulnerabilities';
import Audit from './pages/Audit';
import Compliance from './pages/Compliance';
import DevSecOps from './pages/DevSecOps';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#c62828' },
    secondary: { main: '#ff8f00' },
    background: { default: '#050b13', paper: '#0f1722' },
    text: { primary: '#f5f7fa', secondary: '#98a7b7' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppStateProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/incidents" element={<Incidents />} />
                <Route path="/vulnerabilities" element={<Vulnerabilities />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/devsecops" element={<DevSecOps />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppStateProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
