import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ArtisanRoute } from './components/ArtisanRoute';
import { AdminRoute } from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AuthSuccessPage from './pages/AuthSuccessPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import ArtisansPage from './pages/ArtisansPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import BusinessHelperPage from './pages/BusinessHelperPage';
import ArtisanDashboardPage from './pages/ArtisanDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-earth-50 text-earth-900 selection:bg-gold-200">
      {!isLandingPage && <Navbar />}
      <Routes>
        {/* Landing Page — public welcome dashboard */}
        <Route path="/" element={<LandingPage />} />

        {/* Explore — the original home experience (Process + Story + Collection) */}
        <Route path="/explore" element={<HomePage />} />

        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/artisans" element={<ArtisansPage />} />
        <Route path="/artisans/:id" element={<ArtisanDetailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Artisan-only Routes */}
        <Route
          path="/business-helper"
          element={
            <ArtisanRoute>
              <BusinessHelperPage />
            </ArtisanRoute>
          }
        />
        <Route
          path="/artisan/dashboard"
          element={
            <ArtisanRoute>
              <ArtisanDashboardPage />
            </ArtisanRoute>
          }
        />

        {/* Admin-only Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        {/* Catch-all: redirect unknown URLs to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isLandingPage && <Footer />}
    </div>
  );
}

export default App;

