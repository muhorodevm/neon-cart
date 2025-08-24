
import { useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/ProductCard';

const Collections = () => {
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const collections = [
    {
      title: 'Air Jordan Legacy',
      description: 'Iconic basketball heritage',
      products: products.filter(p => p.name.includes('Jordan'))
    },
    {
      title: 'Air Max Series', 
      description: 'Revolutionary cushioning technology',
      products: products.filter(p => p.name.includes('Air Max'))
    },
    {
      title: 'Classic Lifestyle',
      description: 'Timeless designs for everyday wear',
      products: products.filter(p => p.category === 'Lifestyle')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-nike-dark mb-4">Our Collections</h1>
          <p className="text-xl text-nike-gray max-w-2xl mx-auto">
            Curated collections that define style and performance
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-nike-gray">Loading collections...</div>
          </div>
        ) : (
          <div className="space-y-16">
            {collections.map((collection, index) => (
              <div key={collection.title} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-nike-dark mb-2">{collection.title}</h2>
                  <p className="text-nike-gray">{collection.description}</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {collection.products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
