import { Public_Sans } from "next/font/google";

// One family for everything: Public Sans is a neutral, institutional typeface
// drawn for government and public-service websites. next/font downloads it at
// build time and self-hosts it: no request to Google from the visitor's
// browser and no layout shift. latin-ext is needed for the peso sign (₱).
export const fontSans = Public_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-public-sans",
  display: "swap",
});
