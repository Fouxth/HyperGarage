import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Camera,
  PlayCircle,
  MessageCircle,
  Mail,
  Send,
} from 'lucide-react';

const quickLinks = [
  { to: '/products', label: 'nav.products' },
  { to: '/categories', label: 'nav.categories' },
  { to: '/brands', label: 'nav.brands' },
  { to: '/promotions', label: 'nav.promotions' },
  { to: '/blog', label: 'nav.blog' },
];

const supportLinks = [
  { to: '/help', label: 'footer.helpCenter' },
  { to: '/shipping-info', label: 'footer.shippingInfo' },
  { to: '/returns', label: 'footer.returns' },
  { to: '/order-tracking', label: 'footer.orderTracking' },
  { to: '/contact', label: 'footer.contact' },
];

const legalLinks = [
  { to: '/legal/privacy', label: 'footer.privacy' },
  { to: '/legal/terms', label: 'footer.terms' },
  { to: '/legal/cookies', label: 'footer.cookies' },
  { to: '/legal/warranty', label: 'footer.warranty' },
];

const socialLinks = [
  { href: '#', icon: Globe, label: 'Facebook' },
  { href: '#', icon: Camera, label: 'Instagram' },
  { href: '#', icon: PlayCircle, label: 'YouTube' },
  { href: '#', icon: MessageCircle, label: 'Twitter' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-extrabold italic tracking-tight">
                <span className="text-primary">HYPER</span>
                <span className="text-white">GARAGE</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted hover:text-white transition-colors"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              {t('footer.newsletter')}
            </h4>
            <p className="text-sm text-muted mb-4">
              {t('footer.newsletterDescription')}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-0"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full h-10 pl-9 pr-3 bg-white/5 border border-border rounded-l-lg text-sm text-white placeholder-muted outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 gradient-primary rounded-r-lg text-white hover:opacity-90 transition-opacity"
                aria-label={t('footer.subscribe')}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Social icons */}
        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} HyperGarage. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
