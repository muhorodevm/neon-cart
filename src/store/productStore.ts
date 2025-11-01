import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
}

// Nike products with Kenya Shillings pricing
const nikeProducts: Product[] = [
  // Men's Collection
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG',
    price: 22100,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'The iconic silhouette that started it all.'
  },
  {
    id: '2',
    name: 'Nike Air Max 97',
    price: 20800,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'Inspired by Japanese bullet trains and water droplets.'
  },
  {
    id: '3',
    name: 'Nike Air Force 1 Mid',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'The legend lives on in this all-time classic.'
  },
  {
    id: '4',
    name: 'Nike Dunk High Retro',
    price: 15600,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'Born on the court, made for the streets.'
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    price: 19500,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'Nike\'s biggest heel Air unit yet.'
  },
  {
    id: '6',
    name: 'Nike Blazer Mid 77',
    price: 14300,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'Vintage basketball style with modern comfort.'
  },
  
  // Women's Collection
  {
    id: '7',
    name: 'Nike Dunk Low Women',
    price: 14300,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Classic style meets everyday comfort.'
  },
  {
    id: '8',
    name: 'Nike Air Max 90 Women',
    price: 16900,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Classic comfort meets modern style.'
  },
  {
    id: '9',
    name: 'Nike Air Force 1 Shadow',
    price: 15600,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Double the style, double the fun.'
  },
  {
    id: '10',
    name: 'Nike Blazer Low Platform',
    price: 14300,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Elevated style with platform sole.'
  },
  {
    id: '11',
    name: 'Nike Air Max 270 React',
    price: 18200,
    image: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Comfort and style in every step.'
  },
  {
    id: '12',
    name: 'Nike Cortez Women',
    price: 11700,
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'The legendary running shoe that started it all.'
  },

  // Kids' Collection
  {
    id: '13',
    name: 'Nike Air Max 90 Kids',
    price: 9100,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&h=500&fit=crop',
    category: 'Kids',
    description: 'Iconic style sized for kids.'
  },
  {
    id: '14',
    name: 'Nike Air Force 1 Kids',
    price: 7800,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop',
    category: 'Kids',
    description: 'Classic hoops style for the young ones.'
  },
  {
    id: '15',
    name: 'Nike Cortez Kids',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&h=500&fit=crop',
    category: 'Kids',
    description: 'Comfortable and durable for active kids.'
  },
  {
    id: '16',
    name: 'Nike Revolution 6 Kids',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=500&h=500&fit=crop',
    category: 'Kids',
    description: 'Lightweight running shoes for kids.'
  },
  {
    id: '17',
    name: 'Nike Star Runner 3 Kids',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop',
    category: 'Kids',
    description: 'Built for running and playing.'
  },
  {
    id: '18',
    name: 'Nike Dynamo Go Kids',
    price: 7800,
    image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500&h=500&fit=crop',
    category: 'Kids',
    description: 'Easy on, easy off for busy kids.'
  },

  // Basketball Collection
  {
    id: '19',
    name: 'Nike LeBron 20',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop',
    category: 'Basketball',
    description: 'Elite basketball performance shoe.'
  },
  {
    id: '20',
    name: 'Nike Kyrie 8',
    price: 19500,
    image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=500&h=500&fit=crop',
    category: 'Basketball',
    description: 'Quick cuts and explosive moves.'
  },
  {
    id: '21',
    name: 'Nike KD 15',
    price: 20800,
    image: 'https://images.unsplash.com/photo-1547003897-90cbe1190db7?w=500&h=500&fit=crop',
    category: 'Basketball',
    description: 'Responsive cushioning for the court.'
  }
];

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set({ 
      products: nikeProducts,
      isLoading: false 
    });
  },
}));
