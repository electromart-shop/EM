/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/EM",
  assetPrefix: "/EM/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;