import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useAppDispatch } from '../store/hooks';
import { checkAuth } from '../store/slices/authSlice';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const initialized = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully');
        
        // Refresh user data so the frontend knows the email is verified
        dispatch(checkAuth());
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to verify email');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Verification token is missing');
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-earth-50">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-200/20 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-earth-200/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-earth-900/5 border border-earth-100 relative z-10 text-center"
      >
        {status === 'loading' && (
          <div className="py-8 space-y-4">
            <Loader2 className="w-12 h-12 text-gold-500 animate-spin mx-auto" />
            <h2 className="text-xl font-medium text-earth-900">Verifying your email...</h2>
            <p className="text-earth-500 text-sm">Please wait a moment while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-6 space-y-6"
          >
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-earth-900 mb-2">Email Verified!</h2>
              <p className="text-earth-600 text-sm">{message}</p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-earth-900 text-white rounded-xl font-medium hover:bg-earth-800 transition-colors gap-2"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-6 space-y-6"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-earth-900 mb-2">Verification Failed</h2>
              <p className="text-earth-600 text-sm">{message}</p>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-earth-100 text-earth-900 rounded-xl font-medium hover:bg-earth-200 transition-colors gap-2"
            >
              Go to Sign In
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
