import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";

const AdminOverview = () => {
  const { data } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await adminApi.getDashboardStats();
      return (response as { data: any }).data;
    },
    refetchInterval: 30000,
  });

  const stats = [
    { title: "Total Revenue", value: `KSh ${Number(data?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, change: data?.revenueChange || "" },
    { title: "Orders", value: String(data?.totalOrders || 0), icon: ShoppingCart, change: data?.ordersChange || "" },
    { title: "Products", value: String(data?.totalProducts || 0), icon: Package, change: "" },
    { title: "Customers", value: String(data?.totalCustomers || 0), icon: Users, change: data?.customersChange || "" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverview;
