import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Imports for TanStack Query (React Query)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create QueryClient (This is the central object that will hold and cache the data)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // We can disable refetch on window focus by default, 
      // which might be more stable for financial applications.
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* WE WRAP THE APPLICATION WITH THIS PROVIDER */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);