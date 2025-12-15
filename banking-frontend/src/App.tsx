import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Toaster } from '@/components/ui/toaster';

// -------------------------------------------------------------------
// IMPORTING REAL PAGES
// -------------------------------------------------------------------

// Public Pages (Login, Register)
import { LoginPage } from '@/pages/LoginPage'; // Real Login Page
import { RegisterPage } from '@/pages/RegisterPage'; // Real Register Page

import { DashboardPage } from '@/pages/DashboardPage'; // Real Dashboard Page
// const DashboardPage = () => <div className="p-10 text-center font-bold text-lg">Dashboard (Account Management) Page</div>;
import { TransferPage } from '@/pages/TransferPage'; // Real Transfer Page
import { HistoryPage } from '@/pages/HistoryPage'; // Real History Page
import { AccountDetailsPage } from '@/pages/AccountDetailsPage'; // Real Details Page

// -------------------------------------------------------------------
// MAIN APP COMPONENT
// -------------------------------------------------------------------

function App() {
  return (
    // Outermost Router of the application
    <BrowserRouter>
      <Routes>

        {/* === PUBLIC ROUTES === */}
        {/* Accessible to everyone (No token required) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* === PROTECTED ROUTES === */}
        {/* Only those with JWT (ProtectedRoute) can enter this block */}
        <Route element={<ProtectedRoute />}>

          {/* Common Layout for all protected pages (Navbar, Container) */}
          <Route element={<AppLayout />}>

            {/* Default Route (Root /) */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Account Management and CRUD */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/account/:id" element={<AccountDetailsPage />} />

            {/* Transaction Routes */}
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Route>
        </Route>
      </Routes>

      {/* Toast Notification System (Works everywhere in the app) */}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;