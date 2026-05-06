import React from "react";
import { notFound } from "next/navigation";
import productsData from "@/data/products.json";
import { Product } from "@/context/ShoppingCartContext";
import ProductDetailClient from "./ProductDetailClient";

// Since we are exporting a static site, we need to generate params for all possible products.
export async function generateStaticParams() {
  const products = productsData as Product[];
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const products = productsData as Product[];
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  // Get related products from the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
