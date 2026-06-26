import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto Image Picker | ELECTROMART",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AutoImagePickerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
