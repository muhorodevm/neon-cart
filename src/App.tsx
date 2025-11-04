import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/layout/AdminLayout";
import { RouteProtection } from "@/components/auth/RouteProtection";
import Index from "./pages/Index";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Kids from "./pages/Kids";
import Collections from "./pages/Collections";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Dashboard from "./pages/Dashboard";
import DashboardOrders from "./pages/dashboard/DashboardOrders";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Layout (Navbar + Footer) */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/men" element={<Layout><Men /></Layout>} />
          <Route path="/women" element={<Layout><Women /></Layout>} />
          <Route path="/kids" element={<Layout><Kids /></Layout>} />
          <Route path="/collections" element={<Layout><Collections /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
          
          {/* Customer Dashboard Routes (Protected) */}
          <Route path="/dashboard" element={<RouteProtection><Dashboard /></RouteProtection>} />
          <Route path="/dashboard/orders" element={<RouteProtection><DashboardOrders /></RouteProtection>} />
          <Route path="/dashboard/profile" element={<RouteProtection><DashboardProfile /></RouteProtection>} />
          
          {/* Admin Routes (Protected) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/overview" element={<RouteProtection requireAdmin><AdminLayout><AdminOverview /></AdminLayout></RouteProtection>} />
          <Route path="/admin/products" element={<RouteProtection requireAdmin><AdminLayout><AdminProducts /></AdminLayout></RouteProtection>} />
          <Route path="/admin/orders" element={<RouteProtection requireAdmin><AdminLayout><AdminOrders /></AdminLayout></RouteProtection>} />
          <Route path="/admin/orders/:orderId" element={<RouteProtection requireAdmin><AdminLayout><AdminOrderDetails /></AdminLayout></RouteProtection>} />
          
          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
