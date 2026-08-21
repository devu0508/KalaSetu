import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ShoppingBag, Palette } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signup, signin, clearError } from '../store/slices/authSlice';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

type AuthMode = 'signin' | 'signup';
type UserRole = 'customer' | 'artisan';

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error, user } = useAppSelector((s) => s.auth);

  // Read preferred role passed from LandingPage
  const preferredRole = (location.state as any)?.preferredRole as UserRole | undefined;

  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(preferredRole || 'customer');

  // If landing page sent a role, default to signup mode for new users
  useEffect(() => {
    if (preferredRole === 'artisan') {
      setMode('signup');
    }
  }, [preferredRole]);

  const from = (location.state as any)?.from?.pathname || null;

  // Redirect if already authenticated — route based on user role
  useEffect(() => {
    if (isAuthenticated) {
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'artisan') {
        navigate('/artisan/dashboard', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, from, user?.role]);

  // Show errors from URL (Google OAuth failure)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthError = params.get('error');
    if (oauthError === 'google_failed') {
      toast.error('Google sign-in failed. If running locally, ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in backend/.env with real Google Cloud Console credentials.', { duration: 8000 });
    }
  }, [location.search]);

  // Show Redux errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'signup') {
      const result = await dispatch(signup({ name, email, password, role }));
      if (signup.fulfilled.match(result)) {
        toast.success('Account created! Welcome to KalaSetu.');
      }
    } else {
      const result = await dispatch(signin({ email, password }));
      if (signin.fulfilled.match(result)) {
        toast.success('Welcome back!');
      }
    }
  };

  const handleGoogleAuth = () => {
    // Always pass role so first-time Google users get the correct role
    window.location.href = `/api/auth/google?role=${role}`;
  };

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    dispatch(clearError());
    setName('');
    setEmail('');
    setPassword('');
    setRole('customer');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-earth-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&q=80&w=1920)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-earth-950/90 via-earth-900/80 to-earth-950/90" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.h1
              key={mode}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl text-earth-100 mb-2"
            >
              {mode === 'signin' ? 'Welcome Back' : 'Join KalaSetu'}
            </motion.h1>
            <p className="text-earth-400 text-sm">
              {mode === 'signin'
                ? 'Sign in to continue your journey'
                : 'Create an account to explore handcrafted heritage'}
            </p>
          </div>

          {/* Role Selector — visible in both modes for Google sign-in */}
          <div className="px-8 pb-4">
            <p className="text-earth-400 text-xs uppercase tracking-widest mb-3 text-center">
              {mode === 'signin' ? 'Sign in as' : 'I am a'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                  role === 'customer'
                    ? 'border-gold-500 bg-gold-500/10 text-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'border-white/10 bg-white/5 text-earth-400 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <ShoppingBag size={22} />
                <span className="text-sm font-medium">Customer</span>
                <span className="text-[10px] opacity-70">Browse & buy crafts</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('artisan')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-300 ${
                  role === 'artisan'
                    ? 'border-gold-500 bg-gold-500/10 text-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'border-white/10 bg-white/5 text-earth-400 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
              >
                <Palette size={22} />
                <span className="text-sm font-medium">Artisan</span>
                <span className="text-[10px] opacity-70">Sell your creations</span>
              </button>
            </div>
          </div>

          {/* Google Auth Button */}
          <div className="px-8">
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-earth-50 text-earth-800 font-medium py-3 px-4 rounded-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="px-8 my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-earth-500 text-xs uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<User size={16} />}
                    required
                    className="bg-white/5 border-white/10 text-earth-100 placeholder:text-earth-500 focus:ring-gold-500/30 focus:border-gold-500/50"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={16} />}
              required
              className="bg-white/5 border-white/10 text-earth-100 placeholder:text-earth-500 focus:ring-gold-500/30 focus:border-gold-500/50"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-earth-100 placeholder:text-earth-500 focus:ring-gold-500/30 focus:border-gold-500/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-earth-500 hover:text-earth-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {mode === 'signin' && (
              <div className="flex justify-end mt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs text-earth-400 hover:text-gold-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={isLoading}
              className="w-full mt-6 group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-earth-900/30 border-t-earth-900 rounded-full animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="px-8 pb-8 text-center">
            <p className="text-earth-400 text-sm">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleMode}
                className="text-gold-500 hover:text-gold-400 font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
