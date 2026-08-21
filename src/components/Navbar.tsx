import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Menu, ShoppingBag, X, Heart, User, LogOut, ChevronDown, Package, LayoutDashboard, Sparkles, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { fetchCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { cart } = useAppSelector((s) => s.cart);

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  // Track scroll for navbar background
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('#user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/';

  // On home page use white text (dark hero bg); on other pages use dark text
  const textColorClass = isHomePage && !isScrolled
    ? 'text-earth-100'
    : 'text-earth-800';
  const hoverColorClass = 'hover:text-gold-500';

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await dispatch(logout());
    toast.success('Signed out successfully');
    navigate('/');
  };

  const navLinks = [
    { label: 'Collection', href: '/products' },
    { label: 'Artisans', href: '/artisans' },
    { label: 'Our Story', href: '/#our-story' },
  ];

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
          isScrolled || !isHomePage
            ? 'bg-white/95 backdrop-blur-md border-b border-earth-200/80 shadow-sm py-4'
            : 'bg-transparent py-6'
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'font-serif text-2xl font-bold tracking-widest uppercase transition-colors',
              textColorClass
            )}
          >
            KalaSetu
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'font-medium tracking-wide text-sm uppercase transition-colors',
                    hoverColorClass,
                    isActive && link.href === '/products'
                      ? 'text-gold-500'
                      : textColorClass
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to="/wishlist"
                className={cn(
                  'relative p-2 transition-colors rounded-full',
                  textColorClass,
                  hoverColorClass
                )}
                aria-label="Wishlist"
              >
                <Heart size={22} />
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className={cn(
                'relative p-2 transition-colors rounded-full',
                textColorClass,
                hoverColorClass
              )}
              aria-label="Shopping cart"
            >
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 min-w-[18px] rounded-full bg-gold-500 text-[10px] font-bold flex items-center justify-center text-earth-900 px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu / Auth Button */}
            {isAuthenticated ? (
              <div id="user-menu-container" className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className={cn(
                    'flex items-center gap-1.5 p-2 rounded-full transition-colors',
                    textColorClass,
                    hoverColorClass
                  )}
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-gold-500/50"
                    />
                  ) : (
                    <User size={22} />
                  )}
                  <ChevronDown
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      isUserMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-sm shadow-xl border border-earth-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-earth-100">
                        <p className="text-sm font-semibold text-earth-900 truncate">{user?.name}</p>
                        <p className="text-xs text-earth-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 hover:text-earth-900 transition-colors"
                        >
                          <User size={15} />
                          My Profile
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 hover:text-earth-900 transition-colors"
                        >
                          <Package size={15} />
                          My Cart
                          {cartCount > 0 && (
                            <span className="ml-auto bg-gold-500 text-earth-900 text-[10px] font-bold rounded-full px-1.5 py-0.5">
                              {cartCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 hover:text-earth-900 transition-colors"
                        >
                          <Heart size={15} />
                          Wishlist
                        </Link>
                      </div>
                      {user?.role === 'artisan' && (
                        <div className="border-t border-earth-100 py-1">
                          <Link
                            to="/artisan/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 hover:text-earth-900 transition-colors"
                          >
                            <LayoutDashboard size={15} />
                            My Dashboard
                          </Link>
                          <Link
                            to="/business-helper"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-earth-700 hover:bg-earth-50 hover:text-earth-900 transition-colors"
                          >
                            <Sparkles size={15} />
                            Business Helper
                          </Link>
                        </div>
                      )}
                      {user?.role === 'admin' && (
                        <div className="border-t border-earth-100 py-1">
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                          >
                            <Shield size={15} />
                            Admin Panel
                          </Link>
                        </div>
                      )}
                      <div className="border-t border-earth-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth"
                className={cn(
                  'hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border transition-all duration-200',
                  isScrolled || !isHomePage
                    ? 'border-earth-300 text-earth-800 hover:border-gold-500 hover:text-gold-600'
                    : 'border-white/30 text-earth-100 hover:border-gold-500 hover:text-gold-400'
                )}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={cn('md:hidden p-2 transition-colors rounded-full', textColorClass)}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-earth-950 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <Link
                  to={link.href}
                  className="font-serif text-3xl text-earth-100 hover:text-gold-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className="flex flex-col items-center gap-3 mt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-earth-400 hover:text-earth-100 transition-colors text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={16} />
                    {user?.name || 'My Profile'}
                  </Link>
                  {user?.role === 'artisan' && (
                    <>
                      <Link
                        to="/artisan/dashboard"
                        className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        My Dashboard
                      </Link>
                      <Link
                        to="/business-helper"
                        className="flex items-center gap-2 text-gold-400 hover:text-gold-300 transition-colors text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Sparkles size={16} />
                        Business Helper
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium mt-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Shield size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="px-8 py-3 bg-gold-500 text-earth-900 font-semibold rounded-sm hover:bg-gold-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
