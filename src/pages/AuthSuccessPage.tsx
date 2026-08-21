import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { checkAuth } from '../store/slices/authSlice';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

import api from '../api/axios';

export default function AuthSuccessPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
          // Exchange token to set cookies directly through the Vercel proxy
          await api.post('/auth/exchange-token', { token });
        }

        const result = await dispatch(checkAuth());
        if (checkAuth.fulfilled.match(result)) {
          const role = result.payload?.role;
          if (role === 'artisan') {
            navigate('/artisan/dashboard', { replace: true });
          } else {
            navigate('/products', { replace: true });
          }
        } else {
          navigate('/auth?error=google_failed', { replace: true });
        }
      } catch {
        navigate('/auth?error=google_failed', { replace: true });
      }
    };

    verifyAuth();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-earth-50">
      <div className="text-center">
        <LoadingSpinner size="lg" text="Completing sign in..." />
        <p className="mt-6 text-earth-500 text-sm">
          You'll be redirected momentarily.
        </p>
      </div>
    </div>
  );
}
