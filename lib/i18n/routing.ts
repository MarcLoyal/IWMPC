import { defineRouting } from "next-intl/routing";

export const locales = ["en", "fil"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/**
 * English is the default and is served without a prefix (`/water`);
 * Filipino lives under `/fil/water`. Slugs are English for both locales.
 *
 * Browser-language detection is off on purpose: a fixed default keeps every
 * shared link pointing at the same page. Visitors switch with the language
 * toggle in the header.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});
