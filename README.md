# IWMPC Website

Public website for the **Inicbulan Waterworks Multi-Purpose Cooperative** (Brgy. Inicbulan, Bauan, Batangas).

It answers three questions fast, on a phone: _Is there water today? How much do I pay, and how? How do I join, borrow, or get connected?_

## Stack

- Next.js 16 (App Router, TypeScript, Cache Components) on Vercel
- Tailwind CSS 4 + shadcn/ui-style components (`components/ui`), lucide-react icons
- next-intl — Filipino (default, no URL prefix) and English (`/en/...`)
- Vitest for unit tests; GitHub Actions runs format, lint, typecheck, tests and build on every PR

Forms (Resend + Turnstile), the Keystatic CMS and the calculators arrive in later phases — see the build phases below.

## Getting started

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Requires Node 22+.

| Script              | What it does                           |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Local dev server                       |
| `npm run build`     | Production build                       |
| `npm run lint`      | ESLint                                 |
| `npm run typecheck` | Generate route types + `tsc`           |
| `npm test`          | Vitest                                 |
| `npm run format`    | Prettier (with Tailwind class sorting) |

## Project layout

```
app/[locale]/     Pages and the root layout (one tree for both languages)
components/ui/    shadcn-style primitives (Button, Sheet, …)
components/site/  Header, Footer, MobileActionBar, LanguageToggle, …
lib/i18n/         Locale routing, navigation helpers, request config
lib/site.ts       Site-wide facts, navigation and feature flags (null = not yet confirmed)
lib/billing.ts    Water bill arithmetic (unit-tested)
lib/loan.ts       Flat-interest loan estimate (unit-tested)
messages/         UI strings: fil.json, en.json (must have identical keys)
content/          status.yaml, advisories/*.mdoc, … (managed by Keystatic from P5)
docs/             Content checklist, staff guide (P5)
tests/            Vitest unit tests
proxy.ts          Locale routing (Next.js 16 name for middleware)
```

## Content

- `content/status.yaml` drives the supply status banner on every page. A scheduled interruption whose `ends_at` has passed shows as "normal" automatically; an outage stays until staff clear it.
- `content/advisories/<date>-<name>.mdoc` — one file per advisory. The front matter holds the fields, the body is the Filipino text, and `body_en` is the optional English text. Any `*_en` field left empty falls back to Filipino.
- `content/rates.yaml` holds the water rates. While any rate is still `0` the Rates page shows "rates coming soon" instead of the bill calculator; the build fails if tiers have gaps or overlaps.
- `content/loans.yaml` holds loan products (empty until confirmed) and the application steps.
- The current advisories and status are **samples** (`sample: true`, titles prefixed `[HALIMBAWA]` / `[SAMPLE]`).
- While `placeholderContent` is `true` in `lib/site.ts`, every page shows a "preview" strip and search engines are told not to index the site. Switch it off at launch.

## Ground rules

- **No invented facts.** Anything the cooperative has not confirmed (rates, officers, phone numbers, test results…) stays `null` / `[[TBD]]` and renders as a visible "Kukumpirmahin pa" placeholder, or is hidden behind a flag. See `docs/CONTENT-CHECKLIST.md`.
- **Every string in both languages.** `tests/messages.test.ts` fails if `fil.json` and `en.json` drift apart.
- **Accessibility first.** WCAG 2.2 AA, 18px base type, tap targets ≥ 48px, status never conveyed by colour alone.
- **Design tokens** live in `app/globals.css`. Replace the hex values with the logo colours when the logo arrives; keep the token names.

## Build phases

| Phase | Scope                                                                  | Status  |
| ----- | ---------------------------------------------------------------------- | ------- |
| P0    | Setup: tooling, tokens, fonts, base layout, CI                         | Done    |
| P1    | Home, Water hub, Advisories, Status banner, Contact, Privacy, 404      | Done    |
| P2    | Rates + bill calculator, Loans + loan estimator                        | Done    |
| P3    | Forms (Resend, Turnstile, webhook)                                     |         |
| P4    | Remaining content pages, News + RSS                                    |         |
| P5    | Keystatic CMS + staff guide                                            |         |
| P6    | SEO, OG images, security headers, print styles, Playwright smoke tests |         |
| P7    | Launch                                                                 |         |

Each phase is its own pull request, reviewed on a Vercel preview before merging.
