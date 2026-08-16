import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ArtisanRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that requires the user to be authenticated AND have the "artisan" role.
 * Redirects unauthenticated users to /auth, non-artisans to /.
 */
export function ArtisanRoute({ children }: ArtisanRouteProps) {
  const { isAuthenticated, isCheckingAuth, user } = useAppSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <div className="animate-pulse font-serif text-earth-500 text-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user?.role !== 'artisan') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
