"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";
import { Product, useCart } from "@/context/ShoppingCartContext";
import ProductItemCard from "@/components/product/ProductItemCard";
import AddToCartButton from "@/components/product/AddToCartButton";

const basePath = process.env.NODE_ENV === "production" ? "/EM" : "";

export default function ProductDetailClient({ 
  product, 
  relatedProducts 
}: { 
  product: Product;
  relatedProducts: Product[];
}) {
  const { addRecentlyViewed, recentlyViewed } = useCart();
  const initialImageUrl = product.images?.[0] ? `${basePath}${product.images[0]}` : `${basePath}/images/products/default.jpg`;
  const [mainImage, setMainImage] = useState(initialImageUrl);

  useEffect(() => {
    setMainImage(product.images?.[0] ? `${basePath}${product.images[0]}` : `${basePath}/images/products/default.jpg`);
  }, [product]);

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  // Filter out the current product from recently viewed
  const otherRecentlyViewed = recentlyViewed.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-orange mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Link>

        <div className="flex flex-col md:flex-row gap-12 mb-16">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-50 rounded-3xl p-8 aspect-square flex items-center justify-center relative border border-gray-100">
              {product.originalPrice && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    Student Deal
                  </span>
                </div>
              )}
              <img
                src={mainImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = '/images/products/default.jpg';
                  e.currentTarget.onerror = null;
                }}
                className="w-full h-full object-contain max-h-[400px]"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 mt-6 overflow-x-auto pb-2 px-1">
                {product.images.map((img, idx) => {
                  const imgUrl = `${basePath}${img}`;
                  const isSelected = mainImage === imgUrl;
                  return (
                    <button 
                      key={idx}
                      onClick={() => setMainImage(imgUrl)}
                      className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                        isSelected ? 'border-brand-orange shadow-md' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={imgUrl} 
                        alt={`${product.name} thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/products/default.jpg';
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col">
            <div className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-3">
              {product.category}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className={`text-4xl font-black ${product.originalPrice ? 'text-red-500' : 'text-gray-900'}`}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {(product.tags || []).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Value props */}
            <div className="grid grid-cols-2 gap-4 mb-10 py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">Quality Tested</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                  <Truck size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">Fast Shipping</span>
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Related Components</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductItemCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {otherRecentlyViewed.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherRecentlyViewed.map(p => (
                <ProductItemCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Cart */}
      <AddToCartButton product={product} isMobileSticky={true} />
    </div>
  );
}
