import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Electronic Components",
  description:
    "Browse our complete catalog of electronic components – Arduino, sensors, ICs, resistors, capacitors, motors, displays and more at student-friendly prices in Tamil Nadu.",
  keywords: [
    "buy electronic components online",
    "arduino sensors india",
    "components catalog",
    "microcontrollers resistors capacitors",
    "electronic parts coimbatore",
  ],
  alternates: {
    canonical: "https://electromart-cbe.vercel.app/products",
  },
  openGraph: {
    title: "All Electronic Components | ELECTROMART",
    description: "Browse hundreds of affordable electronic components for engineering students.",
    url: "https://electromart-cbe.vercel.app/products",
    type: "website",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
