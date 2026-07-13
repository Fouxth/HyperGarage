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
  ShoppingCart,
  Star,
  Package,
} from 'lucide-react';
import { useActivity } from '@/api/hooks';

const iconFor = { order: ShoppingCart, review: Star, product: Package };

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const { data: events = [] } = useActivity();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(5);

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
    const navigateBase = i18n.language === 'th' ? 'en' : 'th';
    i18n.changeLanguage(navigateBase);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    setUnreadCount(0);
  };

  const translateMessage = (msg: string) => {
    if (msg.startsWith('New order')) {
      return msg.replace('New order', 'คำสั่งซื้อใหม่').replace('from', 'จาก')
    }
    if (msg.includes('left a') && msg.includes('star review')) {
      return msg.replace('left a', 'เขียนรีวิว').replace('star review', 'ดาว')
    }
    if (msg.startsWith('Product') && msg.includes('was added to the catalog')) {
      return msg.replace('Product', 'สินค้า').replace('was added to the catalog', 'ถูกเพิ่มเข้าสู่แคตตาล็อกร้านค้า')
    }
    return msg
  };

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
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              onClick={handleNotificationsClick}
              className="relative flex items-center justify-center w-9 h-9 rounded-full text-muted hover:text-white hover:bg-white/5 transition-colors"
              aria-label={t('admin.notifications')}
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-primary rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">การแจ้งเตือน</p>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      {events.length} รายการทั้งหมด
                    </span>
                  </div>
                  <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
                    {events.slice(0, 5).map((event, i) => {
                      const Icon = iconFor[event.type as keyof typeof iconFor] || Bell
                      return (
                        <div key={i} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-white leading-relaxed truncate">{translateMessage(event.message)}</p>
                            <p className="text-[10px] text-muted mt-1">
                              {new Date(event.createdAt).toLocaleDateString('th-TH')} {new Date(event.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    {events.length === 0 && (
                      <p className="py-8 text-center text-xs text-muted">ไม่มีการแจ้งเตือนในขณะนี้</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationsOpen(false)
                      navigate('/admin/notifications')
                    }}
                    className="w-full py-2.5 text-center text-xs font-semibold text-muted hover:text-white border-t border-border hover:bg-white/5 transition-colors block"
                  >
                    ดูการแจ้งเตือนทั้งหมด
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/admin/roles');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-muted hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t('admin.profile')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/admin/settings');
                      }}
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
