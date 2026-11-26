import { Mona_Sans } from "next/font/google";

/**
 * The one typeface, self-hosted by next/font at build time (no runtime request to Google).
 * Mona Sans is variable; the UI uses in-between weights (420 / 530 / 640, see tokens.css).
 */
export const mona = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona",
  display: "swap",
});
