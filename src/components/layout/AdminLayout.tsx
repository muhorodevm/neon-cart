import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin/overview" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("userRole");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-primary">NDULA Admin</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
