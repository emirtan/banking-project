import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* All sub-pages will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};