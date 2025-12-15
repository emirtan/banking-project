import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', // Failover to localhost if env not set
  // We can add default headers to all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR: 
 * Runs before every request is sent and adds the JWT Token to the Authorization header.
 */
api.interceptors.request.use((config) => {
  // We get the current token from the Zustand store
  const token = useAuthStore.getState().token;

  if (token) {
    // If token exists, add Authorization header (Bearer Scheme)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/**
 * RESPONSE INTERCEPTOR: 
 * Runs after a response is received from the Backend (e.g. Token Expired).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized) or 403 (Forbidden) error comes
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Authorization Error: Token expired or invalid. Logging out.");
      // Force user to logout automatically
      useAuthStore.getState().logout();
      // Redirect to login page (optional: ProtectedRoute handles it when page refreshes)
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;