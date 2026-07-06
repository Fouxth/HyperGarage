import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
