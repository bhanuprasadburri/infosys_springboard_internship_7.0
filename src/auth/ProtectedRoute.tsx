import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { readSession } from '../utils/authUtils';

export default function ProtectedRoute() {
  const location = useLocation();
  const session = readSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
