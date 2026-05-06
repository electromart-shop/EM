"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product, useCart } from "@/context/ShoppingCartContext";

export default function ProductItemCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 hover:border-brand-orange/30 transition-all duration-300 flex flex-col h-full relative cursor-pointer">
        {product.originalPrice && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              Student Deal
            </span>
          </div>
        )}
        
        <div className="relative bg-gray-50 overflow-hidden p-4 flex items-center justify-center">
          <div className="relative w-full transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
            <img
              src={product.images?.[0]?.replace(/^\/products\//, '/EM/products/').toLowerCase().replace(/\s+/g, '-')}
              alt={product.name}
              loading="lazy"
              className="w-full h-40 sm:h-52 md:h-60 object-contain"
            />
          </div>
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="text-xs font-semibold text-brand-orange uppercase tracking-wider mb-2">
            {product.category}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-brand-orange transition-colors">
            {product.name}
          </h3>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{(product.originalPrice || 0).toLocaleString("en-IN")}
                </span>
              )}
              <span className={`text-lg font-bold ${product.originalPrice ? 'text-red-500' : 'text-gray-900'}`}>
                ₹{(product.price || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-brand-orange hover:text-white transition-colors z-10 relative"
              aria-label="Add to cart"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
