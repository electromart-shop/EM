/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  basePath: '/EM',
  assetPrefix: '/EM/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
