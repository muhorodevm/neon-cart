import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generateReceiptPDF } from "@/lib/pdfGenerator";

interface ReceiptPDFProps {
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  paymentCode?: string;
}

const ReceiptPDF = (props: ReceiptPDFProps) => {
  const handleDownloadPDF = () => {
    const receiptData = {
      orderNumber: props.orderNumber,
      date: props.date,
      customer: props.customerInfo,
      items: props.items,
      subtotal: props.subtotal,
      tax: props.tax,
      shipping: props.shipping,
      total: props.total,
      paymentMethod: props.paymentMethod,
      paymentCode: props.paymentCode,
    };
    const pdf = generateReceiptPDF(receiptData);
    pdf.save(`Receipt-${props.orderNumber}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Order #{props.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">{new Date(props.date).toLocaleDateString()}</p>
          </div>
          <Button onClick={handleDownloadPDF} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Customer Information</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>{props.customerInfo.name}</p>
              <p>{props.customerInfo.email}</p>
              <p>{props.customerInfo.phone}</p>
              <p>{props.customerInfo.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Items</h4>
            <div className="space-y-2">
              {props.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} {item.size && `(Size: ${item.size})`} x {item.quantity}
                  </span>
                  <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>KES {props.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>KES {props.shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>KES {props.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>KES {props.total.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Payment Details</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>Method: {props.paymentMethod}</p>
              {props.paymentCode && <p>Transaction Code: {props.paymentCode}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPDF;
