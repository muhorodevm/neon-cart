import { create } from "zustand";
import { productApi } from "@/lib/api";

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

// Remove in-memory dummy list; fetch from backend instead

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await productApi.getAll();
      const apiProducts = (response as { data: { products: any[] } }).data
        .products;
      console.log(apiProducts);
      const mapped: Product[] = apiProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image:
          Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "",
        category: p.category,
        description: p.description,
      }));
      set({ products: mapped, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
