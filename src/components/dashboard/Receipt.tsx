import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Printer } from 'lucide-react';

interface ReceiptProps {
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
}

const Receipt = ({ orderNumber, date, items, subtotal, tax, total, customerInfo, paymentMethod }: ReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        <p className="text-muted-foreground">Thank you for your order</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Order Number:</span>
            <span className="font-bold">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Date:</span>
            <span>{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Payment Method:</span>
            <span>{paymentMethod}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Customer Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {customerInfo.name}</p>
            <p><span className="font-medium">Email:</span> {customerInfo.email}</p>
            <p><span className="font-medium">Phone:</span> {customerInfo.phone}</p>
            <p><span className="font-medium">Address:</span> {customerInfo.address}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">Order Items</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">KES {item.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (16%)</span>
            <span>KES {tax.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Receipt;
