'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from '@/types/product';
import { useCart } from "@/context/cart-context";
import { ShoppingCart } from "lucide-react"; // icon

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart(); //

  const packSize = "1 Pack";
  const taxesIncluded = "Taxes Included";
  const vendorName = "VAPOR CO";
  const blendType = product.category;
  const thc_mg_placeholder = Math.round(product.price * 2);
  const cbd_mg_placeholder = Math.round(product.price * 0.5);


  const imageSrc = imageError ? "/placeholder.png" : product.image;

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 relative">

      {/* BEST SELLER Badge */}
      {product.stock > 40 && (
        <div className="absolute top-0 left-0 bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-br-lg z-10">
          BEST SELLER
        </div>
      )}

      <div className="p-4 text-center">
        {/* Vendor */}
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
          {vendorName}
        </h3>

        <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">
          {product.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4">{blendType}</p>

        {/* Product Image */}
        <div className="relative w-full h-40 flex justify-center items-center mb-4 bg-gray-50 rounded-lg">
          <Image
            src={imageSrc}
            alt={product.name}
            width={160}
            height={160}
            className="object-contain"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>

        {/* THC/CBD Info */}
        <div className="flex justify-center space-x-6 text-left mb-4">
          <div>
            <p className="text-sm font-bold text-gray-700">THC</p>
            <p className="text-base font-semibold text-green-700">
              {thc_mg_placeholder} mg
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">CBD</p>
            <p className="text-base font-semibold text-red-700">
              {cbd_mg_placeholder} mg
            </p>
          </div>
        </div>

        {/* Pack Size */}
        <div className="flex justify-center mb-4">
          <span className="border border-gray-300 text-xs font-medium text-gray-700 px-3 py-1 rounded-full">
            {packSize}
          </span>
        </div>

        {/* Price, Add to Cart & View Buttons */}
        <div className="pt-2">
          <p className="text-2xl font-extrabold text-gray-900 inline-block">
            ${product.price.toFixed(2)}
          </p>
          <span className="text-xs text-gray-500 ml-1">
            {taxesIncluded}
          </span>

          <div className="mt-3 flex gap-2">
            {/* ✅ Add to Cart Button */}
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                })
              }
              className="flex items-center justify-center gap-1 w-1/2 border-2 border-gray-300 text-gray-700 hover:bg-green-100 hover:border-green-600 hover:text-green-600 font-semibold py-2 rounded-lg transition duration-200"
            >
              <ShoppingCart size={18} />
              <span>Add</span>
            </button>

            {/* ✅ View Button */}
            <Link
              href={`/products/${product.id}`}
              className="w-1/2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-2 rounded-lg text-center transition duration-200"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
