import { Courier_Prime, Libre_Franklin } from "next/font/google";

/**
 * Landing-page faces, self-hosted by next/font at build time (no request to Google at runtime).
 * Libre Franklin: the Franklin Gothic of institutional signage and catalogue drawer labels.
 * Courier Prime: the typed index card, used only for schema entries, call numbers and stamps.
 * App screens and the public form keep system fonts.
 */
export const display = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const typed = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-typed",
  display: "swap",
});
