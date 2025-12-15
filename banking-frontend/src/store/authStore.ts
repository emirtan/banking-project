import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Define State Interface
// This must be exported to resolve the 'any' error in step 4.
export interface AuthState {
  user: {
    username: string;
    id: string; // userId added
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, username: string, userId: string) => void; // signature update
  logout: () => void;
}

// 2. Create Zustand Store
export const useAuthStore = create<AuthState>()(
  // persist middleware: Stores state in localStorage
  persist(
    (set) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,

      // Action (Method): Called when logged in
      login: (token, username, userId) => set({
        token,
        user: { username, id: userId },
        isAuthenticated: true
      }),

      // Action (Method): Called when logged out
      logout: () => set({
        token: null,
        user: null,
        isAuthenticated: false
      }),
    }),
    {
      name: 'banking-auth-storage', // Key name to be used in LocalStorage
    }
  )
);