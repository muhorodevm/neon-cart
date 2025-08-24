
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

// Mock cart data
const mockCartItems = [
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG',
    price: 170,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop',
    size: '10',
    quantity: 1
  },
  {
    id: '2',
    name: 'Nike Air Max 90',
    price: 120,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    size: '9.5',
    quantity: 2
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 150 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center mb-6 sm:mb-8">
          <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-nike-orange mr-3" />
          <h1 className="text-2xl sm:text-4xl font-bold text-nike-dark">Shopping Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-6xl mb-4">🛒</div>
            <h2 className="text-xl sm:text-2xl font-bold text-nike-dark mb-4">Your cart is empty</h2>
            <p className="text-nike-gray mb-6 sm:mb-8 px-4">Add some amazing Nike products to get started!</p>
            <Button 
              className="bg-nike-orange hover:bg-nike-orange/90 text-white px-6 sm:px-8 py-2 sm:py-3"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm border">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mx-auto sm:mx-0"
                  />
                  
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-nike-dark text-base sm:text-lg">{item.name}</h3>
                    <p className="text-nike-gray text-sm">Size: {item.size}</p>
                    <p className="text-lg sm:text-xl font-bold text-nike-orange mt-2">${item.price}</p>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 mx-auto sm:mx-0"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-nike-light-gray/30 p-4 sm:p-6 rounded-xl h-fit sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold text-nike-dark mb-4 sm:mb-6">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-nike-gray">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nike-gray">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nike-gray">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-nike-dark">Total</span>
                    <span className="text-lg sm:text-xl font-bold text-nike-orange">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white py-3 text-base sm:text-lg font-semibold"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>

              {shipping > 0 && (
                <p className="text-xs sm:text-sm text-nike-gray mt-4 text-center">
                  Add ${(150 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
