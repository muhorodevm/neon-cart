import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
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
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      role: null,

      login: (token, user) => {
        const role = user.role;
        set({
          token,
          user,
          isAuthenticated: true,
          role,
        });

        // Optional: safely set in localStorage if needed by API client
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
          localStorage.setItem("userRole", role);
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
        }

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          role: null,
        });
      },

      updateUser: (userUpdates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdates } : null,
        })),
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
