import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RouteProtectionProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const RouteProtection = ({ children, requireAdmin = false }: RouteProtectionProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("authToken");
    const adminToken = localStorage.getItem("adminAuth");
    const isAdminRole = localStorage.getItem("userRole") === "admin";

    if (requireAdmin) {
      if (!adminToken || !isAdminRole) {
        navigate("/admin/login");
      }
    } else {
      if (!userToken) {
        navigate("/login");
      }
    }
  }, [navigate, requireAdmin]);

  return <>{children}</>;
};
