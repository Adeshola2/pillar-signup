import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center text-brand" role="status">
      <Spinner className="h-7 w-7" />
      <span className="sr-only">Loading your account</span>
    </div>
  );
}

/** Dashboard and other signed-in pages. */
export function ProtectedRoute() {
  const { user, status } = useAuth();
  const location = useLocation();
  if (status === 'loading') return <FullScreenLoader />;
  if (!user) return <Navigate to="/signin" replace state={{ from: location }} />;
  return <Outlet />;
}

/** Sign-in and sign-up: signed-in users skip straight to the dashboard. */
export function PublicOnlyRoute() {
  const { user, status } = useAuth();
  if (status === 'loading') return <FullScreenLoader />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
