import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  profile?: {
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
  };
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (token: string, user: User) => {
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
        
        // Store in localStorage for API client
        localStorage.setItem('authToken', token);
        if (isAdmin) {
          localStorage.setItem('adminAuth', token);
          localStorage.setItem('userRole', user.role);
        }
        
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin,
        });
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('userRole');
        
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
