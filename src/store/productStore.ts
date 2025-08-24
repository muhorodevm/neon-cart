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

// Simulated Nike products data
const nikeProducts: Product[] = [
  {
    id: '1',
    name: 'Air Jordan 1 Retro High OG',
    price: 170,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'The iconic silhouette that started it all.'
  },
  {
    id: '2',
    name: 'Nike Air Max 90',
    price: 120,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
    category: 'Lifestyle',
    description: 'Classic comfort meets modern style.'
  },
  {
    id: '3',
    name: 'Nike Dunk Low',
    price: 100,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Born on the court, made for the streets.'
  },
  {
    id: '4',
    name: 'Air Force 1 \'07',
    price: 90,
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop',
    category: 'Lifestyle',
    description: 'The legend lives on in this all-time classic.'
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    price: 150,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop',
    category: 'Running',
    description: 'Nike\'s biggest heel Air unit yet.'
  },
  {
    id: '6',
    name: 'Nike Blazer Mid \'77',
    price: 100,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop',
    category: 'Women',
    description: 'Vintage basketball style with modern comfort.'
  },
  {
    id: '7',
    name: 'Nike Air Max 97',
    price: 160,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
    category: 'Men',
    description: 'Inspired by Japanese bullet trains and water droplets.'
  },
  {
    id: '8',
    name: 'Nike React Infinity Run',
    price: 160,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=500&fit=crop',
    category: 'Running',
    description: 'Designed to help reduce running injuries.'
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
