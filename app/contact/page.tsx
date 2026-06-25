import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ELECTROMART for electronic component purchases, pricing, or project requirements. Find our business address at Gandhipuram, Coimbatore, call +91 63816 01900, or send an email.",
  alternates: {
    canonical: "https://electromart-cbe.vercel.app/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
