"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  iconSize?: number;
}

/**
 * ProductImage component with built-in loading skeleton and error fallback.
 * - Shows a shimmer skeleton while the image loads
 * - Shows a clean icon placeholder if the image fails to load
 * - No external placeholder.png dependency
 */
export default function ProductImage({
  src,
  alt,
  className = "",
  containerClassName = "",
  iconSize = 32,
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // If no valid src, show fallback immediately
  const showFallback = hasError || !src || src.trim() === "";

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Loading Skeleton */}
      {isLoading && !showFallback && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
          </div>
        </div>
      )}

      {/* Error / No Image Fallback */}
      {showFallback ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg gap-2">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
            <ImageOff size={iconSize} className="text-gray-300" />
          </div>
          <span className="text-xs text-gray-400 font-medium">No image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
