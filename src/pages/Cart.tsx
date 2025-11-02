import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import Receipt from '@/components/dashboard/Receipt';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-nike-gray" />
          <h2 className="text-3xl font-bold text-nike-dark mb-4">Your cart is empty</h2>
          <p className="text-nike-gray mb-8">
            Start shopping and add items to your cart to see them here.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-nike-orange hover:bg-nike-orange/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 20000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + shipping + tax;

  const handleMpesaPayment = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    
    // Simulate M-Pesa payment process
    setTimeout(() => {
      toast.success('M-Pesa payment initiated! Check your phone for the payment prompt.');
      
      // Simulate payment confirmation
      setTimeout(() => {
        const orderNumber = `ORD-${Date.now()}`;
        const receipt = {
          orderNumber,
          date: new Date().toLocaleDateString(),
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price * item.quantity,
          })),
          subtotal,
          tax,
          total,
          customerInfo: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: phoneNumber,
            address: '123 Main Street, Nairobi, Kenya',
          },
          paymentMethod: 'M-Pesa',
        };

        setReceiptData(receipt);
        setIsProcessing(false);
        setIsCheckoutOpen(false);
        toast.success('Payment successful! Your order has been placed.');
        clearCart();
        setPhoneNumber('');
        setShowReceipt(true);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-nike-dark mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-nike-light-gray rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-nike-dark">{item.name}</h3>
                        <p className="text-nike-gray text-sm">Size: {item.size}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <span className="text-xl font-bold text-nike-dark">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-nike-dark">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-nike-gray">
                    <span>Subtotal</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-nike-gray">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between text-nike-gray">
                    <span>Tax (16%)</span>
                    <span>KES {tax.toLocaleString()}</span>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-xl font-bold text-nike-dark">
                    <span>Total</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <p className="text-sm text-nike-gray bg-nike-light-gray p-3 rounded-lg">
                    Add KES {(20000 - subtotal).toLocaleString()} more for FREE shipping!
                  </p>
                )}

                <Button 
                  size="lg" 
                  className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white font-semibold py-6"
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  Proceed to Checkout
                </Button>

                <Link to="/">
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* M-Pesa Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              M-Pesa Payment
            </DialogTitle>
            <DialogDescription>
              Enter your M-Pesa phone number to complete your payment of KES {total.toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Enter your Safaricom number starting with 07 or 01
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>KES {tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={handleMpesaPayment}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Pay with M-Pesa'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {receiptData && <Receipt {...receiptData} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
