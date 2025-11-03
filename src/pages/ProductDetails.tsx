import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const product = products.find(p => p.id === id);
  const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];
  
  // Get related products from the same category
  const relatedProducts = products
    .filter(p => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-nike-dark mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-nike-light-gray/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-nike-light-gray rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 bg-nike-dark/10 text-nike-dark">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold text-nike-dark mb-4">{product.name}</h1>
              <p className="text-nike-gray text-lg leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-nike-orange mb-8">
                KES {product.price.toLocaleString()}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-nike-dark">Select Size</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 border-2 rounded-lg text-center font-medium transition-all ${
                      selectedSize === size
                        ? 'border-nike-orange bg-nike-orange text-white'
                        : 'border-gray-200 hover:border-nike-gray text-nike-dark'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-nike-dark">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-nike-light-gray"
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-nike-light-gray"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white py-4 text-lg font-semibold"
                disabled={!selectedSize}
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    quantity
                  });
                  toast({
                    title: "Added to cart",
                    description: `${product.name} (Size ${selectedSize}) added to your cart.`,
                  });
                  navigate('/cart');
                }}
              >
                Buy Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-nike-dark text-nike-dark hover:bg-nike-dark hover:text-white py-4 text-lg font-semibold"
                disabled={!selectedSize}
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    quantity
                  });
                  toast({
                    title: "Added to cart",
                    description: `${product.name} (Size ${selectedSize}) added to your cart.`,
                  });
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex space-x-4 pt-4">
              <Button variant="ghost" size="sm" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-nike-orange" />
                <span className="text-nike-gray">Free shipping on orders over KES 20,000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-nike-orange" />
                <span className="text-nike-gray">2-year warranty included</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-nike-orange" />
                <span className="text-nike-gray">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-nike-dark mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
