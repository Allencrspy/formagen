import { Inter } from "next/font/google";

/**
 * The one typeface, self-hosted by next/font at build time (no runtime request to Google).
 * Variable weight; the UI uses 400, 500 and 600 only.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
