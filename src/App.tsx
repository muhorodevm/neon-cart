import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminLayout from "./admin/AdminLayout";
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
import DashboardOrders from "./customer/pages/DashboardOrders";
import DashboardProfile from "./customer/pages/DashboardProfile";
import DashboardAddresses from "./customer/pages/DashboardAddresses";
import CustomerLayout from "./customer/CustomerLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminOverview from "./admin/pages/AdminOverview";
import AdminProducts from "./admin/pages/AdminProducts";
import AdminOrders from "./admin/pages/AdminOrders";
import AdminCustomers from "./admin/pages/AdminCustomers";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminOrderDetails from "./admin/pages/AdminOrderDetails";
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
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route
            path="/men"
            element={
              <Layout>
                <Men />
              </Layout>
            }
          />
          <Route
            path="/women"
            element={
              <Layout>
                <Women />
              </Layout>
            }
          />
          <Route
            path="/kids"
            element={
              <Layout>
                <Kids />
              </Layout>
            }
          />
          <Route
            path="/collections"
            element={
              <Layout>
                <Collections />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <Signup />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Layout>
                <ProductDetails />
              </Layout>
            }
          />

          {/* Customer Dashboard Routes (Protected, with CustomerLayout sidebar) */}
          <Route
            path="/dashboard"
            element={
              <RouteProtection>
                <CustomerLayout>
                  <DashboardOrders />
                </CustomerLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <RouteProtection>
                <CustomerLayout>
                  <DashboardOrders />
                </CustomerLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <RouteProtection>
                <CustomerLayout>
                  <DashboardProfile />
                </CustomerLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/dashboard/addresses"
            element={
              <RouteProtection>
                <CustomerLayout>
                  <DashboardAddresses />
                </CustomerLayout>
              </RouteProtection>
            }
          />

          {/* Admin Routes (Protected) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/overview"
            element={
              <RouteProtection requireAdmin>
                <AdminLayout>
                  <AdminOverview />
                </AdminLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RouteProtection requireAdmin>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RouteProtection requireAdmin>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/admin/orders/:orderId"
            element={
              <RouteProtection requireAdmin>
                <AdminLayout>
                  <AdminOrderDetails />
                </AdminLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <RouteProtection requireAdmin>
                <AdminLayout>
                  <AdminCustomers />
                </AdminLayout>
              </RouteProtection>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RouteProtection requireAdmin>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </RouteProtection>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
