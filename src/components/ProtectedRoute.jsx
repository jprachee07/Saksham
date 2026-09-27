import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect unauthenticated user to Expert Login, preserving the attempted path
    return <Navigate to="/expert/login" state={{ from: location }} replace />;
  }

  return children;
}
