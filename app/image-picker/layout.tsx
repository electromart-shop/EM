import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Picker | ELECTROMART",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ImagePickerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
