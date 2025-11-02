import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, DollarSign, ShoppingCart, Users, TrendingUp, AlertCircle, BarChart3, Settings, ClipboardList, Plus, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ProductForm from '@/components/forms/ProductForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showProductForm, setShowProductForm] = useState(false);

  const stats = {
    totalProducts: 156,
    totalOrders: 1240,
    revenue: 4578000,
    customers: 892
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 17000, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 22000, status: 'pending', date: '2024-01-20' },
    { id: 'ORD-003', customer: 'Bob Johnson', amount: 9000, status: 'shipped', date: '2024-01-25' }
  ];

  const products = [
    { id: '1', name: 'Air Jordan 1 Retro High OG', stock: 45, price: 17000, sales: 120, status: 'active' },
    { id: '2', name: 'Nike Air Max 90', stock: 12, price: 12000, sales: 89, status: 'active' },
    { id: '3', name: 'Nike Dunk Low', stock: 0, price: 10000, sales: 156, status: 'out_of_stock' },
    { id: '4', name: 'Air Force 1 \'07', stock: 78, price: 9000, sales: 203, status: 'active' }
  ];

  const topProducts = [
    { name: 'Air Force 1 \'07', sales: 203, revenue: 1827000 },
    { name: 'Nike Dunk Low', sales: 156, revenue: 1560000 },
    { name: 'Air Jordan 1 Retro High OG', sales: 120, revenue: 2040000 }
  ];

  const menuItems = [
    { title: 'Overview', icon: BarChart3, section: 'overview' },
    { title: 'Products', icon: Package, section: 'products' },
    { title: 'Orders', icon: ShoppingCart, section: 'orders' },
    { title: 'Customers', icon: Users, section: 'customers' },
    { title: 'Analytics', icon: TrendingUp, section: 'analytics' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'shipped':
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleProductSubmit = (data: any) => {
    console.log('Product submitted:', data);
    setShowProductForm(false);
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: string) => {
    console.log('Updating order', orderId, 'to', newStatus);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.section}>
                      <SidebarMenuButton
                        onClick={() => setActiveSection(item.section)}
                        className={activeSection === item.section ? 'bg-muted' : ''}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1">
          <header className="h-16 border-b flex items-center px-6 gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </header>

          <div className="p-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalProducts}</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalOrders}</div>
                      <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">KES {stats.revenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+15% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.customers}</div>
                      <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>KES {order.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <ProductForm onSubmit={handleProductSubmit} />
                    </DialogContent>
                    <Button onClick={() => setShowProductForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Product
                    </Button>
                  </Dialog>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Product List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Sales</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {product.stock}
                                {product.stock < 20 && product.stock > 0 && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>KES {product.price.toLocaleString()}</TableCell>
                            <TableCell>{product.sales}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(product.status)}>
                                {product.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Sales Analytics</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Top Selling Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">KES {product.revenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Low Stock Alert</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {products.filter(p => p.stock < 20 && p.stock > 0).map((product) => (
                          <Alert key={product.id}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                              <span className="font-medium">{product.name}</span>
                              <Badge variant="secondary">{product.stock} left</Badge>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Out of Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {products.filter(p => p.stock === 0).map((product) => (
                          <Alert key={product.id} variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between">
                              <span className="font-medium">{product.name}</span>
                              <Badge variant="destructive">Out of Stock</Badge>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Order Management</h2>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>KES {order.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>
                              <Select onValueChange={(value) => handleOrderStatusUpdate(order.id, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipping">Shipping</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'customers' && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Customer list and management features coming soon...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
