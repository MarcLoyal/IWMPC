/**
 * Site-wide facts. `null` means "not yet confirmed by the cooperative" and is
 * rendered as a visible placeholder — never replace null with a guess.
 * In P5 this moves to a Keystatic singleton (content/site.yaml).
 */
export const site = {
  /**
   * true while the site still shows sample advisories and unconfirmed facts.
   * Shows a "preview" strip on every page and tells search engines not to
   * index the site. Set to false at launch (P7).
   */
  placeholderContent: true,
  shortName: "IWMPC",
  legalName: "Inicbulan Waterworks Multi-Purpose Cooperative",
  // From the project brief; verify against the current Certificate of Registration.
  cdaRegistrationNo: "9520-04002341",
  address: "Waterworks Office, Brgy. Inicbulan, Bauan, Batangas",
  officeHours: null as string | null,
  phone: null as string | null,
  emergencyHotline: null as string | null,
  email: null as string | null,
  facebookUrl: null as string | null,
  messengerUrl: null as string | null,
  /** Search text for the embedded map — no hand-picked coordinates. */
  mapQuery: "Inicbulan, Bauan, Batangas",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const primaryNav = [
  { key: "water", href: "/water" },
  { key: "services", href: "/services" },
  { key: "membership", href: "/membership" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

export const secondaryNav = [
  { key: "about", href: "/about" },
  { key: "transparency", href: "/about/transparency" },
  { key: "faq", href: "/faq" },
  { key: "privacy", href: "/privacy" },
] as const;

export const REPORT_HREF = "/water/report";
