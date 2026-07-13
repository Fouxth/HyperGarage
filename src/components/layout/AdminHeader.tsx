import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationCount = 5; // TODO: wire to notification state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('hypergarage_admin_user');
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('hypergarage_admin_token');
    localStorage.removeItem('hypergarage_admin_user');
    navigate('/admin/login');
  };

  const toggleLanguage = () => {
    const next = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(next);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 glass-strong lg:ml-[260px]">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: hamburger + search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder={t('admin.search.placeholder')}
                className="w-full h-9 pl-9 pr-4 bg-white/5 border border-border rounded-lg text-sm text-white placeholder-muted outline-none focus:border-border-light transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center justify-center h-8 px-2.5 rounded-full text-xs font-semibold text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-border transition-colors"
          >
            {i18n.language === 'th' ? 'EN' : 'TH'}
          </button>

          {/* Notification bell */}
          <button
            type="button"
            className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
            aria-label={t('admin.notifications')}
          >
            <Bell className="w-[18px] h-[18px]" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-white">
                {user?.name || 'Admin'}
              </span>
              <ChevronDown
                className={`hidden sm:block w-3.5 h-3.5 text-muted transition-transform ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-muted">{user?.email || 'admin@hypergarage.com'}</p>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t('admin.profile')}
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      {t('admin.nav.settings')}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-primary hover:bg-white/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('admin.logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
