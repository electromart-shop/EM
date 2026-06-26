import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import productsData from "@/data/products.json";
import { Product } from "@/context/ShoppingCartContext";
import ProductDetailClient from "./ProductDetailClient";

const BASE_URL = "https://electromart-cbe.vercel.app";

function isValidImage(img: string) {
  return img && typeof img === "string" && img.trim() !== "" && !img.includes("placeholder");
}

const allProducts = productsData as Product[];
const validProducts = allProducts.filter(
  (p) => Array.isArray(p.images) && p.images.some(isValidImage)
);

// ─── Static Params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  return validProducts.map((product) => ({ id: product.id }));
}

// ─── Schema Generator Helper ──────────────────────────────────────────────────
function getProductSchema(product: Product) {
  const firstValidImage = product.images?.find(isValidImage);
  const imageUrl = firstValidImage?.startsWith("http")
    ? firstValidImage
    : firstValidImage
    ? `${BASE_URL}${firstValidImage}`
    : `${BASE_URL}/images/og-banner.png`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} from ELECTROMART`,
    image: imageUrl,
    sku: product.id,
    brand: { "@type": "Brand", name: "ELECTROMART" },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.id}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "ELECTROMART" },
    },
    category: product.category,
  };
}

// ─── Dynamic Metadata per product ────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = validProducts.find((p) => p.id === params.id);

  if (!product) {
    return {
      title: "Product Not Found | ELECTROMART",
      description: "This product could not be found.",
    };
  }

  const title = `${product.name} | ELECTROMART`;
  const description = product.description
    ? `${product.description.slice(0, 155)}…`
    : `Buy ${product.name} at ₹${product.price.toLocaleString("en-IN")} – ${product.category} from ELECTROMART. Affordable electronics for students in Tamil Nadu.`;

  const firstValidImage = product.images?.find(isValidImage);
  const imageUrl = firstValidImage?.startsWith("http")
    ? firstValidImage
    : firstValidImage
    ? `${BASE_URL}${firstValidImage}`
    : `${BASE_URL}/images/og-banner.png`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      "buy electronic components",
      "electronics tamil nadu",
      "electromart",
      ...(product.tags || []),
    ],
    alternates: {
      canonical: `${BASE_URL}/products/${product.id}`,
    },
    openGraph: {
      type: "website",
      url: `${BASE_URL}/products/${product.id}`,
      title,
      description,
      images: [{ url: imageUrl, width: 800, height: 800, alt: product.name }],
      siteName: "ELECTROMART",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    other: {
      "product:price:amount": String(product.price),
      "product:price:currency": "INR",
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductPage({ params }: { params: { id: string } }) {
  const product = validProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = validProducts
    .filter(
      (p) =>
        p.category &&
        product.category &&
        p.category.trim().toLowerCase() === product.category.trim().toLowerCase() &&
        p.id !== product.id
    )
    .slice(0, 4);

  const productSchema = getProductSchema(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
