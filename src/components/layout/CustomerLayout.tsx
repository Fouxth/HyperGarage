import { Outlet } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { useSettings } from '@/api/hooks';

function MaintenanceScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <Wrench className="h-12 w-12 text-primary" />
      <h1 className="text-2xl font-bold text-white">We'll be right back</h1>
      <p className="max-w-md text-sm text-muted">
        HyperGarage is currently down for maintenance. Please check back shortly.
      </p>
    </div>
  );
}

export default function CustomerLayout() {
  const { data: settings, isLoading } = useSettings();

  if (!isLoading && settings?.maintenanceMode) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
