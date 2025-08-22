
import { Product } from '@/store/productStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up gradient-card">
      <div 
        className="relative overflow-hidden bg-nike-light-gray aspect-square"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge 
          variant="secondary" 
          className="absolute top-4 left-4 bg-nike-dark/90 text-white border-0"
        >
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-nike-dark group-hover:text-nike-orange transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-nike-gray text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-nike-dark">
            ${product.price}
          </span>
          <Button 
            size="sm" 
            className="bg-nike-orange hover:bg-nike-orange/90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
