import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formagen",
  description: "Server-driven form builder",
};

// System fonts only: no font download on the public form page.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
