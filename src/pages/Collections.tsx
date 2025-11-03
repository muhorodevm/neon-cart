
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
      description: 'Iconic basketball heritage meets street culture',
      products: products.filter(p => p.name.includes('Jordan'))
    },
    {
      title: 'Air Max Series', 
      description: 'Revolutionary cushioning technology for ultimate comfort',
      products: products.filter(p => p.name.includes('Air Max'))
    },
    {
      title: 'Basketball Collection',
      description: 'Performance footwear for the court',
      products: products.filter(p => p.category === 'Basketball')
    },
    {
      title: 'Lifestyle Essentials',
      description: 'Timeless designs for everyday wear and casual style',
      products: products.filter(p => p.category === 'Lifestyle' || p.name.includes('Air Force'))
    },
    {
      title: 'Running Collection',
      description: 'Built for speed, comfort, and endurance',
      products: products.filter(p => p.category === 'Running')
    },
    {
      title: 'Women\'s Exclusives',
      description: 'Designed specifically for women athletes',
      products: products.filter(p => p.category === 'Women')
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
          <div className="space-y-16">
            {[...Array(3)].map((_, colIndex) => (
              <div key={colIndex} className="space-y-6">
                <div className="text-center">
                  <div className="h-8 bg-muted rounded w-64 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted rounded w-48 mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg aspect-square mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
                  {collection.products.slice(0, 4).map((product, productIndex) => (
                    <ProductCard key={product.id} product={product} index={productIndex} />
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
