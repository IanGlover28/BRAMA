'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from '@/types/product';
import { useCartStore } from "@/hooks/use-cart-store";
import { ShoppingCart, Star } from "lucide-react"; // Added Star icon
import WishlistButton from "./wishlist-button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  const productType = product.category; // e.g., Lip Care, Skin Care

  const imageSrc = imageError ? "/placeholder.png" : product.image;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 relative group">

      {/* Wishlist heart */}
      <div className="absolute top-3 left-3 z-20">
        <WishlistButton productId={product.id} />
      </div>

      {/* BEST SELLER Badge */}
      {product.stock > 40 && (
        <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
          BEST SELLER
        </div>
      )}

      {/* Link the image area for quick viewing */}
      <Link href={`/products/${product.id}`}>
        {/* Product Image */}
        <div className="relative w-full h-52 flex justify-center items-center p-4 bg-pink-50/70 overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            width={200}
            height={200}
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>
      </Link>

      <div className="p-7 text-left">
     
        <Link href={`/products/${product.id}`} className="block">
          <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2 hover:text-pink-700 transition">
            {product.name}
          </h2>
        </Link>
        
        <p className="text-sm text-gray-500 mb-2">{productType}</p>

        {/* Rating & Size/Volume */}
        <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
            <Star size={16} fill="currentColor" />
            <span>{product.stock > 40 ? "New" : "Popular"}</span>
  
          </div>
          
          
        </div>

        {/* Price & Add to Cart Button */}
        <div className="flex justify-between items-center mt-3">
          <p className="text-md font-extrabold text-gray-900">
            ₵{product.price.toFixed(2)}
          </p>

          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            aria-label={`Add ${product.name} to bag`}
            className="flex items-center justify-center bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        
        {/* Simplified View Button/Link */}
        <Link
            href={`/products/${product.id}`}
            className="text-xs text-gray-500 mt-2 block hover:text-pink-600 transition text-center"
        >
            View Details
        </Link>

      </div>
    </div>
  );
}