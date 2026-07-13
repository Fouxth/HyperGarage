import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token and user details to localStorage
      localStorage.setItem('hypergarage_admin_token', data.token);
      localStorage.setItem('hypergarage_admin_user', JSON.stringify(data.user));

      // Redirect to admin dashboard
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#161412] border border-border/80 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header/Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-extrabold italic tracking-tight select-none">
            <span className="text-primary">HYPER</span>
            <span className="text-white">GARAGE</span>
          </span>
          <h2 className="text-lg font-semibold text-white/90 mt-4">
            ระบบจัดการหลังร้าน
          </h2>
          <p className="text-xs text-muted mt-1">
            ลงชื่อเข้าใช้งานด้วยสิทธิ์ผู้ดูแลระบบหรือพนักงาน
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-primary/10 border border-primary/20 rounded-xl p-4 text-primary text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              อีเมลพนักงาน (Email)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hypergarage.com"
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-border rounded-xl text-sm text-white placeholder-muted outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 bg-white/5 border border-border rounded-xl text-sm text-white placeholder-muted outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 gradient-primary rounded-xl text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 transition-opacity mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบหลังบ้าน'}
          </button>
        </form>

        <div className="text-center mt-8 text-[11px] text-muted leading-relaxed">
          มีปัญหาการใช้งานหรือลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบหลัก<br />
          &copy; {new Date().getFullYear()} HyperGarage. สงวนลิขสิทธิ์
        </div>
      </div>
    </div>
  );
}
