import { defineRouting } from "next-intl/routing";

export const locales = ["fil", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fil";

/**
 * Filipino is the default and is served without a prefix (`/water`);
 * English lives under `/en/water`. Slugs are English for both locales.
 *
 * Browser-language detection is off on purpose: many members use phones set
 * to English but expect the Filipino site, and a fixed default keeps every
 * shared link pointing at the same page.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});
