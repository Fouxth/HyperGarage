import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const navLinks = [
  { to: '/', label: 'nav.home' },
  { to: '/products', label: 'nav.products' },
  { to: '/categories', label: 'nav.categories' },
  { to: '/brands', label: 'nav.brands' },
  { to: '/promotions', label: 'nav.promotions' },
  { to: '/blog', label: 'nav.blog' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { count: cartCount } = useCart();
  const { ids: wishlistIds } = useWishlist();

  const toggleLanguage = () => {
    const next = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(next);
  };

  useEffect(() => {
    if (searchExpanded && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchExpanded]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 select-none">
              <span className="text-xl font-extrabold italic tracking-tight">
                <span className="text-primary">HYPER</span>
                <span className="text-white">GARAGE</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-white bg-white/5'
                        : 'text-muted hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {t(link.label)}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <div className="relative hidden sm:flex items-center">
                <motion.div
                  animate={{ width: searchExpanded ? 220 : 36 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center overflow-hidden rounded-full bg-white/5 border border-transparent focus-within:border-border-light"
                >
                  <button
                    type="button"
                    onClick={() => setSearchExpanded(!searchExpanded)}
                    className="flex-shrink-0 flex items-center justify-center w-9 h-9 text-muted hover:text-white transition-colors"
                    aria-label={t('nav.search')}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  {searchExpanded && (
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder={t('search.placeholder')}
                      className="w-full bg-transparent text-sm text-white placeholder-muted pr-3 outline-none"
                      onBlur={() => setSearchExpanded(false)}
                    />
                  )}
                </motion.div>
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label={t('nav.wishlist')}
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label={t('nav.cart')}
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                to="/account"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label={t('nav.account')}
              >
                <User className="w-[18px] h-[18px]" />
              </Link>

              {/* Language toggle */}
              <button
                type="button"
                onClick={toggleLanguage}
                className="hidden sm:flex items-center justify-center h-8 px-2.5 rounded-full text-xs font-semibold text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-border transition-colors"
              >
                {i18n.language === 'th' ? 'EN' : 'TH'}
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card border-l border-border flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <span className="text-lg font-extrabold italic tracking-tight">
                  <span className="text-primary">HYPER</span>
                  <span className="text-white">GARAGE</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search (mobile) */}
              <div className="px-5 py-3 border-b border-border">
                <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                  <Search className="w-4 h-4 text-muted flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className="w-full bg-transparent text-sm text-white placeholder-muted outline-none"
                  />
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-5 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-white bg-white/5 border-r-2 border-primary'
                          : 'text-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {t(link.label)}
                  </NavLink>
                ))}
              </nav>

              {/* Drawer footer actions */}
              <div className="border-t border-border px-5 py-4 space-y-3">
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-muted hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  {t('nav.account')}
                </Link>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-3 text-sm text-muted hover:text-white transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                  {i18n.language === 'th' ? 'English' : 'ภาษาไทย'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
