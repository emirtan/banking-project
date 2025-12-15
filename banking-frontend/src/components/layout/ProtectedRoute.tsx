import { useAuthStore } from '@/store/authStore';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protected Route Component
 * Checks if the user is authenticated.
 */
export const ProtectedRoute = () => {
  // Get authentication state from Zustand store
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If user is authenticated, render child components (Dashboard, Transfer etc.)
  if (isAuthenticated) {
    return <Outlet />;
  }

  // If user is not authenticated, redirect to Login page
  // 'replace' prop prevents the user from going back to this page with back button.
  return <Navigate to="/login" replace />;
};