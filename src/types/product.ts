export interface Product { 
id: string; 
  name: string;
  description: string;
  price: number; 
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductDisplayProps {
  title: string;
  products: Product[];
}