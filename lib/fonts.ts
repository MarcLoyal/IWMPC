import { Inter, Plus_Jakarta_Sans } from "next/font/google";

// next/font downloads these at build time and self-hosts them: no request to
// Google from the visitor's browser and no layout shift.
// latin-ext is needed for the peso sign (₱).
export const fontBody = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});
