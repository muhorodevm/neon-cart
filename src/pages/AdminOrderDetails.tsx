import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Printer } from "lucide-react";

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Mock order data - replace with actual data fetching
  const order = {
    id: orderId,
    orderNumber: "ORD-2024-006",
    date: "2024-03-15",
    customer: "John Doe",
    email: "john@example.com",
    phone: "+254 700 000000",
    status: "Delivered",
    paymentMethod: "M-Pesa",
    shippingAddress: {
      street: "123 Main Street",
      city: "Nairobi",
      postalCode: "00100",
      country: "Kenya",
    },
    items: [
      {
        id: 1,
        name: "Nike Air Max 90",
        size: "UK 10",
        quantity: 1,
        price: 12000,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      },
      {
        id: 2,
        name: "Adidas Ultraboost",
        size: "UK 9",
        quantity: 2,
        price: 15000,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      },
    ],
    subtotal: 42000,
    tax: 6720,
    shippingCost: 500,
    total: 49220,
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 print:hidden">
        <Button variant="outline" onClick={() => navigate("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">Order Details</CardTitle>
              <p className="text-muted-foreground">
                Order #{order.orderNumber}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Status */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                className="mt-1"
                variant={order.status === "Delivered" ? "default" : "secondary"}
              >
                {order.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{order.date}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
            <div className="text-muted-foreground">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      KES {item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>KES {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (16%)</span>
                <span>KES {order.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>KES {order.shippingCost.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>KES {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .container, .container * {
            visibility: visible;
          }
          .container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrderDetails;
