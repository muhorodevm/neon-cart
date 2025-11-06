import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminAuthApi } from "@/lib/api";

type AdminUser = {
  id: string;
  email: string;
  roles: string[];
  profile?: any;
};

interface AdminAuthState {
  token: string | null;
  admin: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      token: null,
      admin: null,
      loading: false,
      error: null,
      async login(email: string, password: string) {
        set({ loading: true, error: null });
        try {
          const res = await adminAuthApi.login({ email, password });
          const { token, user } = (
            res as { data: { token: string; user: AdminUser } }
          ).data;
          localStorage.setItem("adminAuth", token);
          localStorage.setItem("userRole", "admin");
          set({ token, admin: user, loading: false });
        } catch (err: any) {
          const message = err?.response?.data?.error || "Login failed";
          set({ error: message, loading: false });
          throw err;
        }
      },
      logout() {
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("userRole");
        set({ token: null, admin: null });
      },
    }),
    { name: "admin-auth" }
  )
);
