import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    "/admin",
    "/admin/",
    "/api/",
    "/cart",
    "/cart/",
    "/image-picker",
    "/image-picker/",
    "/auto-image-picker",
    "/auto-image-picker/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowedPaths,
      },
    ],
    sitemap: "https://electromart-cbe.vercel.app/sitemap.xml",
    host: "https://electromart-cbe.vercel.app",
  };
}
