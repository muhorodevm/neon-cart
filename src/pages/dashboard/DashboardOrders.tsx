import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Receipt from "@/components/dashboard/Receipt";

const DashboardOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      total: "KSh 15,995",
      status: "DELIVERED",
      items: [
        { name: "Air Max 270", size: "42", quantity: 1, price: 15995 }
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-16",
      total: "KSh 24,998",
      status: "SHIPPED",
      items: [
        { name: "React Infinity", size: "38", quantity: 2, price: 12499 }
      ],
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
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
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Receipt</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Receipt
              orderNumber={selectedOrder.id}
              date={selectedOrder.date}
              items={selectedOrder.items}
              subtotal={15995}
              tax={2559}
              total={18554}
              customerInfo={{
                name: "John Doe",
                email: "john@example.com",
                phone: "+254 712 345 678",
                address: "Nairobi, Kenya"
              }}
              paymentMethod="M-PESA"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardOrders;
