import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { orderApi, paymentApi, userApi } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressForm from '@/components/forms/AddressForm';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddressData, setNewAddressData] = useState<any>(null);
  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await userApi.getAddresses();
        const body = (res as { data: { addresses?: any[] } }).data;
        const list = Array.isArray(body?.addresses) ? body.addresses : [];
        setAddresses(list);
        const def = list.find((a: any) => a.isDefault) || list[0];
        setSelectedAddressId(def?.id);
      } catch {
        setAddresses([]);
      }
    };
    if (isCheckoutOpen) load();
  }, [isCheckoutOpen]);

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

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Resolve address to use
      const defaultAddress = !useNewAddress ? (addresses.find((addr: any) => addr.id === selectedAddressId)
        || addresses.find((addr: any) => addr.isDefault)
        || addresses[0]) : null;

      // Create order
      const orderData: any = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        })),
        paymentMethod: 'MPESA',
        mpesaPhoneNumber: phoneNumber,
        subtotal,
        tax,
        shipping,
        total,
      };

      if (useNewAddress && newAddressData) {
        orderData.address = {
          street: newAddressData.street,
          city: newAddressData.city,
          state: newAddressData.state,
          postalCode: newAddressData.postalCode,
          country: newAddressData.country,
          isDefault: false,
        };
      } else {
        orderData.addressId = defaultAddress?.id;
      }

      const orderResponse = await orderApi.create(orderData);
      const order = (orderResponse as { data: { order: any } }).data.order;

      toast.success('Order created! Initiating M-Pesa payment...');

      // Initiate M-Pesa payment
      const paymentResponse = await paymentApi.initiateMpesa({
        orderId: order.id,
        phoneNumber,
        amount: total,
      });
      const payment = (paymentResponse as { data: { payment: { mpesaReceiptNumber: string } } }).data.payment;
      const receipt = {
        orderNumber: order.orderNumber,
        date: new Date().toLocaleDateString(),
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price * item.quantity,
        })),
        subtotal,
        tax,
        shipping,
        total,
        customerInfo: {
          name: 'Customer',
          email: 'customer@example.com',
          phone: phoneNumber,
          address: `${defaultAddress?.street}, ${defaultAddress?.city}${defaultAddress?.state ? ', ' + defaultAddress.state : ''}, ${defaultAddress?.country}`,
        },
        paymentMethod: 'M-Pesa',
        paymentCode: payment?.mpesaReceiptNumber,
      };
      setReceiptData(receipt);
      setIsProcessing(false);
      setIsCheckoutOpen(false);
      toast.success('Payment successful! Your order has been placed.');
      clearCart();
      setPhoneNumber('');
      setShowReceipt(true);
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
      toast.error(error?.response?.data?.error || 'Checkout failed. Please try again.');
    }
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
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
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
            {/* Address Selector */}
            <div className="space-y-2">
              <Label>Shipping Address</Label>
              {!useNewAddress && (
              <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                <SelectTrigger>
                  <SelectValue placeholder={addresses.length ? 'Select address' : 'No addresses found'} />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((addr: any) => (
                    <SelectItem key={addr.id} value={addr.id}>
                      {addr.street}, {addr.city}{addr.state ? `, ${addr.state}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              )}
              <div className="flex items-center justify-between">
                <Label className="text-sm">Use new address</Label>
                <Button variant="outline" size="sm" onClick={() => setUseNewAddress((v) => !v)}>
                  {useNewAddress ? 'Use saved' : 'Add new'}
                </Button>
              </div>
              {useNewAddress && (
                <div className="mt-2 border rounded p-2">
                  <AddressForm
                    initialData={newAddressData || undefined}
                    onSubmit={(data) => setNewAddressData(data)}
                    onCancel={() => setUseNewAddress(false)}
                  />
                </div>
              )}
            </div>

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
