import type { Metadata } from "next";
import { mona } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Formagen",
  description: "Build a form once. Every response stays tied to the version it answered.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={mona.variable}>
      <body>{children}</body>
    </html>
  );
}
