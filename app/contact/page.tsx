import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

const BASE_URL = "https://electromart-cbe.vercel.app";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ELECTROMART for electronic component purchases, pricing, or project requirements. Find our business address at Gandhipuram, Coimbatore, call +91 63816 01900, or send an email.",
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/contact`,
    title: "Contact Us | ELECTROMART",
    description:
      "Get in touch with ELECTROMART for electronic component purchases, pricing, or project requirements in Coimbatore, Tamil Nadu.",
    images: [
      {
        url: `${BASE_URL}/images/og-banner.png`,
        width: 1200,
        height: 630,
        alt: "Contact ELECTROMART Coimbatore",
      },
    ],
    siteName: "ELECTROMART",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | ELECTROMART",
    description:
      "Get in touch with ELECTROMART for electronic component purchases, pricing, or project requirements in Coimbatore, Tamil Nadu.",
    images: [`${BASE_URL}/images/og-banner.png`],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ELECTROMART",
  "image": `${BASE_URL}/images/og-banner.png`,
  "@id": `${BASE_URL}/contact/#localbusiness`,
  "url": `${BASE_URL}/contact`,
  "telephone": "+916381601900",
  "priceRange": "₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Gandhipuram",
    "addressLocality": "Coimbatore",
    "addressRegion": "Tamil Nadu",
    "postalCode": "641012",
    "addressCountry": "IN"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": []
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactClient />
    </>
  );
}
