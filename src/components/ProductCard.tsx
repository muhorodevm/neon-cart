
import { useNavigate } from 'react-router-dom';
import { Product } from '@/store/productStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up gradient-card cursor-pointer"
      onClick={handleClick}
    >
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
          <p className="text-nike-gray text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-nike-dark">
            ${product.price}
          </span>
          <span className="text-sm text-nike-gray font-medium px-3 py-1 bg-nike-light-gray rounded-full">
            View Details
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
