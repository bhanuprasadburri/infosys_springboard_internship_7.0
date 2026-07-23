import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { readSession } from '../utils/authUtils';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

export default function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const location = useLocation();
  const session = readSession();

  if (!session?.user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (adminOnly && session.mode !== 'admin') {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
