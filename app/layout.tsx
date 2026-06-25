import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopHeader from "@/components/layout/TopHeader";
import BottomFooter from "@/components/layout/BottomFooter";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CartProvider } from "@/context/ShoppingCartContext";
import { getAssetPath } from "@/lib/getAssetPath";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const BASE_URL = "https://electromart-cbe.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f58220" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "ELECTROMART | Electronic Components at Student Prices – Tamil Nadu",
    template: "%s | ELECTROMART",
  },
  description:
    "Buy electronic components at near wholesale prices in Tamil Nadu. Arduino, sensors, modules, resistors & more. Trusted by engineering students. Fast delivery across Coimbatore.",
  applicationName: "ELECTROMART",
  keywords: [
    "electronic components",
    "buy electronics online",
    "arduino coimbatore",
    "electronic parts tamil nadu",
    "student electronics",
    "microcontrollers india",
    "sensors modules cheap",
    "electromart cbe",
    "buy resistors capacitors",
    "engineering electronics store",
    "components online india",
    "wholesale electronics student price",
  ],
  authors: [{ name: "ELECTROMART", url: BASE_URL }],
  creator: "ELECTROMART",
  publisher: "ELECTROMART",
  category: "E-commerce, Electronics",

  // Canonical URL
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
    },
  },

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "ELECTROMART",
    title: "ELECTROMART | Electronic Components at Student Prices – Tamil Nadu",
    description:
      "Affordable electronic components for engineering students in Tamil Nadu. Arduino, sensors, ICs and more at near wholesale prices.",
    images: [
      {
        url: `${BASE_URL}/images/og-banner.png`,
        width: 1200,
        height: 630,
        alt: "ELECTROMART – Electronic Components Store Tamil Nadu",
        type: "image/png",
      },
    ],
  },

  // Twitter / X Cards
  twitter: {
    card: "summary_large_image",
    title: "ELECTROMART | Student-Priced Electronic Components",
    description:
      "Near-wholesale electronic components for engineering students in Tamil Nadu. Shop Arduino, sensors, modules & more.",
    images: [`${BASE_URL}/images/og-banner.png`],
    creator: "@electromart_cbe",
    site: "@electromart_cbe",
  },

  // Icons
  icons: {
    icon: [
      { url: getAssetPath("/images/website-icon.png"), type: "image/png" },
      { url: getAssetPath("/images/website-icon.png"), sizes: "32x32", type: "image/png" },
      { url: getAssetPath("/images/website-icon.png"), sizes: "192x192", type: "image/png" },
    ],
    shortcut: getAssetPath("/images/website-icon.png"),
    apple: [
      { url: getAssetPath("/images/website-icon.png"), sizes: "180x180", type: "image/png" },
    ],
  },

  // Manifest
  manifest: "/manifest.webmanifest",

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification – Google Search Console
  verification: {
    google: "urR1lQEVKZwuG_sIrwQJ5CFHl6RDUIo41Cc6-dJJ6cg",
    // bing: "YOUR_BING_WEBMASTER_TOKEN",
  },

  // Other
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${BASE_URL}/#store`,
  name: "ELECTROMART",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.jpg`,
  image: `${BASE_URL}/images/og-banner.png`,
  description:
    "ELECTROMART provides affordable electronic components for engineering students across Tamil Nadu at near wholesale prices.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Coimbatore",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "electromart.cbe@gmail.com",
    contactType: "customer service",
    availableLanguage: ["English", "Tamil"],
  },
  sameAs: [],
  priceRange: "₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, UPI, Bank Transfer",
  openingHours: "Mo-Sa 09:00-18:00",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "ELECTROMART",
  description: "Electronic components at student-friendly prices in Tamil Nadu.",
  publisher: { "@id": `${BASE_URL}/#store` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <TopHeader />
          <main className="flex-grow" id="main-content">
            {children}
          </main>
          <BottomFooter />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
