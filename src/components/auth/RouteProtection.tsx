import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RouteProtectionProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const RouteProtection = ({ children, requireAdmin = false }: RouteProtectionProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("userAuth") === "true";
    const isAdmin = localStorage.getItem("userRole") === "admin";
    const hasAdminAuth = localStorage.getItem("adminAuth") === "true";

    if (requireAdmin) {
      if (!hasAdminAuth || !isAdmin) {
        navigate("/admin/login");
      }
    } else {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [navigate, requireAdmin]);

  return <>{children}</>;
};
