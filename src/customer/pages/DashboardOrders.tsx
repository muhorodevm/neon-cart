import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Receipt from "@/components/dashboard/Receipt";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type OrderItem = {
  name: string;
  size: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  subtotal: number;
  tax: number;
  status: string;
  items: OrderItem[];
  receiptUrl?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
};

const DashboardOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading, isError } = useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const response = await orderApi.getMyOrders();
      return (response as { data: { orders: Order[] } }).data.orders;
    },
  });

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

  if (isLoading)
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-24 justify-self-end" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  if (isError) return <p>Failed to load orders.</p>;

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
                <TableHead>Order Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>KSh {order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
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
          {selectedOrder && selectedOrder.receiptUrl ? (
            <div className="h-[70vh]">
              <iframe src={selectedOrder.receiptUrl} title="Receipt" className="w-full h-full border-none" />
            </div>
          ) : selectedOrder && (() => {
            const items = (selectedOrder.items || []).map((it: any) => ({
              name: it.name || it.product?.name || "Item",
              quantity: it.quantity,
              price: Number(it.price) * Number(it.quantity || 1),
            }));
            const addr = (selectedOrder as any).address;
            const customerInfo = selectedOrder.customer || {
              name: "Customer",
              email: "N/A",
              phone: "N/A",
              address: addr
                ? `${addr.street}, ${addr.city}${addr.state ? ", " + addr.state : ""}, ${addr.country}`
                : "N/A",
            };
            return (
              <Receipt
                orderNumber={selectedOrder.orderNumber}
                date={new Date(selectedOrder.createdAt).toLocaleDateString()}
                items={items}
                subtotal={selectedOrder.subtotal}
                tax={selectedOrder.tax}
                total={selectedOrder.total}
                customerInfo={customerInfo}
                paymentMethod={selectedOrder.paymentMethod}
              />
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardOrders;


