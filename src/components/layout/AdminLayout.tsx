import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('hypergarage_admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="lg:ml-[260px] p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
