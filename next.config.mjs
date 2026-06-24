/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Performance: enable compression
  compress: true,
  // Generate ETags for better caching
  generateEtags: true,
  // PoweredByHeader off for security
  poweredByHeader: false,
  // Trailing slash consistency
  trailingSlash: false,
};

export default nextConfig;