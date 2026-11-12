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
  // Matches the project brief and the cooperative's Facebook page; still worth
  // checking against the current Certificate of Registration.
  cdaRegistrationNo: "9520-04002341",
  // Address, phone and founding date are from the cooperative's Facebook page.
  address: "Purok Yakal, Brgy. Inicbulan, Bauan, Batangas 4201",
  /** Established and registered with the CDA (ISO date). */
  founded: "2003-07-01",
  /** Office hours, one line per schedule, in each language. */
  officeHours: {
    fil: ["Lunes–Biyernes: 7:30 AM – 4:30 PM", "Sabado: 7:30 AM – 11:00 AM"],
    en: ["Monday–Friday: 7:30 AM – 4:30 PM", "Saturday: 7:30 AM – 11:00 AM"],
  } as Record<"fil" | "en", string[]> | null,
  /** As people write it locally… */
  phone: "0910 491 8512" as string | null,
  /** …and in international form for tel: links. */
  phoneTel: "+639104918512" as string | null,
  /** Office landline (Batangas area code 043), as written locally… */
  hotline: "(043) 740-0767" as string | null,
  /** …and in international form for tel: links. */
  hotlineTel: "+63437400767" as string | null,
  email: null as string | null,
  facebookUrl: null as string | null,
  messengerUrl: null as string | null,
  /** Search text for the embedded map — no hand-picked coordinates. */
  mapQuery: "Purok Yakal, Inicbulan, Bauan, Batangas",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** Whole years since the cooperative was founded, as of `now`. */
export function yearsOfService(now: Date): number {
  const founded = new Date(`${site.founded}T00:00:00+08:00`);
  let years = now.getFullYear() - founded.getFullYear();
  const anniversary = new Date(founded);
  anniversary.setFullYear(now.getFullYear());
  if (now < anniversary) years -= 1;
  return years;
}

/** Feature flags (spec §8). They move to the Keystatic site settings in P5. */
export const flags = {
  show_online_payment_details: false,
  show_financial_highlights: false,
  show_loan_estimator: true,
  show_water_quality: true,
} as const;

export const REPORT_HREF = "/water/report";

export type NavChild = { key: string; href: string };
export type NavItem = { key: string; href: string; children?: NavChild[] };

/**
 * Main navigation. Items with `children` open a dropdown on hover or keyboard
 * focus on desktop and are listed indented in the mobile menu.
 * Labels: `nav.<key>` for items, `nav.sub.<key>` for children.
 */
export const primaryNav: NavItem[] = [
  {
    key: "water",
    href: "/water",
    children: [
      { key: "advisories", href: "/water/advisories" },
      { key: "rates", href: "/water/rates" },
      { key: "pay", href: "/water/pay" },
      { key: "newConnection", href: "/water/new-connection" },
      { key: "report", href: REPORT_HREF },
      { key: "quality", href: "/water/quality" },
      { key: "serviceArea", href: "/water/service-area" },
    ],
  },
  {
    key: "services",
    href: "/services",
    children: [
      { key: "rice", href: "/services/rice" },
      { key: "lpg", href: "/services/lpg" },
      { key: "loans", href: "/services/loans" },
    ],
  },
  { key: "membership", href: "/membership" },
  { key: "news", href: "/news" },
  {
    key: "aboutShort",
    href: "/about",
    children: [
      { key: "about", href: "/about" },
      { key: "officers", href: "/about/officers" },
      { key: "transparency", href: "/about/transparency" },
      { key: "faq", href: "/faq" },
      { key: "privacy", href: "/privacy" },
    ],
  },
  { key: "contact", href: "/contact" },
];

export const secondaryNav = [
  { key: "about", href: "/about" },
  { key: "transparency", href: "/about/transparency" },
  { key: "faq", href: "/faq" },
  { key: "privacy", href: "/privacy" },
] as const;
