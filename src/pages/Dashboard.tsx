import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CreditCard, User, MapPin, Download, BarChart3, Edit, Trash2 } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import ProfileForm from '@/components/forms/ProfileForm';
import AddressForm from '@/components/forms/AddressForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Receipt from '@/components/dashboard/Receipt';
import DashboardAnalytics from './dashboard/DashboardAnalytics';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('orders');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 17000,
      items: [{ name: 'Air Jordan 1 Retro High OG', quantity: 1, price: 17000 }]
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipping',
      total: 22000,
      items: [{ name: 'Nike Air Max 90', quantity: 1, price: 12000 }, { name: 'Nike Dunk Low', quantity: 1, price: 10000 }]
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      status: 'processing',
      total: 9000,
      items: [{ name: 'Air Force 1 \'07', quantity: 1, price: 9000 }]
    }
  ];

  const addresses = [
    {
      id: 1,
      label: 'Home Address',
      street: '123 Main Street',
      city: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      isDefault: true
    }
  ];

  const menuItems = [
    { title: 'Orders', icon: Package, section: 'orders' },
    { title: 'Profile', icon: User, section: 'profile' },
    { title: 'Addresses', icon: MapPin, section: 'addresses' },
    { title: 'Analytics', icon: BarChart3, section: 'analytics' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'shipping': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleProfileUpdate = (data: any) => {
    console.log('Profile updated:', data);
  };

  const handleAddressSubmit = (data: any) => {
    console.log('Address submitted:', data);
    setShowAddressForm(false);
    setEditingAddress(null);
    toast({
      title: editingAddress ? 'Address Updated' : 'Address Added',
      description: editingAddress ? 'Your address has been updated successfully' : 'New address has been added successfully',
    });
  };

  const handleDeleteAddress = (id: number) => {
    console.log('Delete address:', id);
    toast({
      title: 'Address Deleted',
      description: 'Address has been removed successfully',
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">My Dashboard</h2>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
            <h1 className="text-2xl font-bold">Customer Dashboard</h1>
          </header>

          <div className="p-6">
            {activeSection === 'orders' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                      <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">KES 124,000</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Orders</h2>
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <h3 className="font-semibold">{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <p key={index} className="text-sm">
                                  {item.name} × {item.quantity}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="text-lg font-semibold">KES {order.total.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Track Order
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedOrderForReceipt({
                                      orderId: order.id,
                                      date: order.date,
                                      items: order.items,
                                      subtotal: order.total,
                                      total: order.total,
                                      customerName: 'John Doe',
                                      customerEmail: 'john.doe@example.com',
                                      customerPhone: '+254 712 345 678'
                                    })}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Receipt
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Order Receipt</DialogTitle>
                                  </DialogHeader>
                                  {selectedOrderForReceipt && (
                                    <Receipt 
                                      orderNumber={selectedOrderForReceipt.orderId}
                                      date={selectedOrderForReceipt.date}
                                      items={selectedOrderForReceipt.items}
                                      subtotal={selectedOrderForReceipt.subtotal}
                                      tax={0}
                                      total={selectedOrderForReceipt.total}
                                      customerInfo={{
                                        name: selectedOrderForReceipt.customerName,
                                        email: selectedOrderForReceipt.customerEmail,
                                        phone: selectedOrderForReceipt.customerPhone,
                                        address: '123 Main Street, Nairobi'
                                      }}
                                      paymentMethod="M-Pesa"
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileForm
                    initialData={{
                      firstName: 'John',
                      lastName: 'Doe',
                      email: 'john.doe@example.com',
                      phone: '+254 712 345 678',
                    }}
                    onSubmit={handleProfileUpdate}
                  />
                </CardContent>
              </Card>
            )}

            {activeSection === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditingAddress(null)}>Add New Address</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        initialData={editingAddress}
                        onSubmit={handleAddressSubmit}
                        onCancel={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {address.label}
                              {address.isDefault && <Badge>Default</Badge>}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-2">
                              {address.street}<br />
                              {address.city}, {address.postalCode}<br />
                              {address.country}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditingAddress(address);
                                setShowAddressForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'analytics' && <DashboardAnalytics />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
