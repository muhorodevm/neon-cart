import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const navigate = useNavigate();

  const orders = [
    {
      id: "ORD-2024-001",
      customer: "John Doe",
      total: "KSh 15,995",
      status: "DELIVERED",
      date: "2024-01-15",
    },
    {
      id: "ORD-2024-002",
      customer: "Jane Smith",
      total: "KSh 24,998",
      status: "SHIPPED",
      date: "2024-01-16",
    },
    {
      id: "ORD-2024-003",
      customer: "Mike Johnson",
      total: "KSh 6,999",
      status: "PROCESSING",
      date: "2024-01-17",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DELIVERED: "bg-green-500",
      SHIPPED: "bg-blue-500",
      PROCESSING: "bg-yellow-500",
      PENDING: "bg-gray-500",
      CANCELLED: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrders;
