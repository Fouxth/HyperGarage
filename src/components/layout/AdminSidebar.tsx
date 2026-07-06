import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Tag,
  Bookmark,
  Warehouse,
  Database,
  ShoppingCart,
  CreditCard,
  Truck,
  Ticket,
  Zap,
  Users,
  Shield,
  BarChart3,
  Settings,
  FileText,
  Bell,
  HardDrive,
  Wrench,
  ChevronDown,
  X,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      { to: '/admin', label: 'admin.nav.dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'admin.nav.productManagement',
    items: [
      { to: '/admin/products', label: 'admin.nav.products', icon: Package },
      { to: '/admin/categories', label: 'admin.nav.categories', icon: Tag },
      { to: '/admin/brands', label: 'admin.nav.brands', icon: Bookmark },
      { to: '/admin/inventory', label: 'admin.nav.inventory', icon: Warehouse },
      { to: '/admin/compatibility', label: 'admin.nav.compatibilityDB', icon: Database },
    ],
  },
  {
    title: 'admin.nav.orderManagement',
    items: [
      { to: '/admin/orders', label: 'admin.nav.orders', icon: ShoppingCart },
      { to: '/admin/payments', label: 'admin.nav.payments', icon: CreditCard },
      { to: '/admin/shipping', label: 'admin.nav.shipping', icon: Truck },
    ],
  },
  {
    title: 'admin.nav.marketing',
    items: [
      { to: '/admin/coupons', label: 'admin.nav.coupons', icon: Ticket },
      { to: '/admin/flash-sale', label: 'admin.nav.flashSale', icon: Zap },
    ],
  },
  {
    title: 'admin.nav.users',
    items: [
      { to: '/admin/users', label: 'admin.nav.userList', icon: Users },
      { to: '/admin/roles', label: 'admin.nav.roles', icon: Shield },
    ],
  },
  {
    title: 'admin.nav.system',
    items: [
      { to: '/admin/reports', label: 'admin.nav.reports', icon: BarChart3 },
      { to: '/admin/settings', label: 'admin.nav.settings', icon: Settings },
      { to: '/admin/logs', label: 'admin.nav.logs', icon: FileText },
      { to: '/admin/notifications', label: 'admin.nav.notifications', icon: Bell },
      { to: '/admin/backup', label: 'admin.nav.backup', icon: HardDrive },
      { to: '/admin/maintenance', label: 'admin.nav.maintenance', icon: Wrench },
    ],
  },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-border flex-shrink-0">
        <Link to="/admin" className="select-none">
          <span className="text-lg font-extrabold italic tracking-tight">
            <span className="text-primary">HYPER</span>
            <span className="text-white">GARAGE</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin profile */}
      <div className="px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-muted truncate">{t('admin.role.superAdmin')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navSections.map((section, sIdx) => {
          const isCollapsed = section.title
            ? collapsedSections.has(section.title)
            : false;

          return (
            <div key={sIdx} className={section.title ? 'mt-4' : ''}>
              {section.title && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full px-2 mb-1 group"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted group-hover:text-muted-light transition-colors">
                    {t(section.title)}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted transition-transform ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>
              )}

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {section.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/admin'}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive
                              ? 'text-white bg-primary/10 font-medium'
                              : 'text-muted hover:text-white hover:bg-white/5'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0 transition-colors" />
                        <span className="truncate">{t(item.label)}</span>
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[260px] bg-card border-r border-border z-40 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[260px] bg-card border-r border-border z-50 flex flex-col lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
