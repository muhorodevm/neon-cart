
import { useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/ProductCard';

const Kids = () => {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const kidsProducts = products.slice(0, 4); // Sample kids products

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-nike-dark mb-4">Kids' Collection</h1>
          <p className="text-xl text-nike-gray max-w-2xl mx-auto">
            Fun and functional footwear designed for active kids
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-nike-gray">Loading products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {kidsProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Kids;
