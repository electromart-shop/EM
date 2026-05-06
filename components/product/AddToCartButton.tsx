"use client";

import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Product, useCart } from "@/context/ShoppingCartContext";

interface AddToCartButtonProps {
  product: Product;
  isMobileSticky?: boolean;
}

export default function AddToCartButton({ product, isMobileSticky = false }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isMobileSticky) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-40 flex items-center gap-4">
        <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white h-12">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 h-full text-gray-500 hover:text-brand-orange transition-colors font-medium"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-gray-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 h-full text-gray-500 hover:text-brand-orange transition-colors font-medium"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-12 rounded-xl flex items-center justify-center font-bold transition-all ${
            added 
              ? "bg-green-500 text-white" 
              : "bg-brand-orange text-brand-black"
          }`}
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-4 mt-auto">
      <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white h-14">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 h-full text-gray-500 hover:text-brand-orange transition-colors font-medium text-xl"
        >
          -
        </button>
        <span className="w-12 text-center font-bold text-gray-900 text-lg">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 h-full text-gray-500 hover:text-brand-orange transition-colors font-medium text-xl"
        >
          +
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className={`flex-1 h-14 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
          added 
            ? "bg-green-500 text-white" 
            : "bg-brand-orange text-brand-black hover:bg-[#ff943d] shadow-[0_0_20px_rgba(245,130,32,0.3)] hover:shadow-[0_0_30px_rgba(245,130,32,0.5)]"
        }`}
      >
        {added ? (
          <>
            <Check size={24} className="mr-2" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={24} className="mr-2" /> Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
