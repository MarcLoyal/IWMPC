import type { Metadata } from "next";
import { DownloadIcon, FileTextIcon, ShieldCheckIcon } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { getMemberDuties, localized } from "@/lib/content";
import { Container } from "@/components/site/container";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("membership");
  return { title: t("title"), description: t("intro") };
}

export default async function MembershipPage() {
  const [t, tj, tc, tb, locale, duties] = await Promise.all([
    getTranslations("membership"),
    getTranslations("home.join"),
    getTranslations("common"),
    getTranslations(),
    getLocale() as Promise<Locale>,
    getMemberDuties(),
  ]);

  return (
    <>
      {/* Page title, above the hero panel */}
      <Container className="pt-6 md:pt-8">
        <nav
          aria-label={tb("breadcrumbs.label")}
          className="text-sm text-muted-foreground"
        >
          <Link href="/" className="text-primary underline underline-offset-4">
            {tc("home")}
          </Link>
          <span aria-hidden="true"> › </span>
          <span>{t("title")}</span>
        </nav>
        <h1 className="mt-4 text-center text-3xl font-extrabold tracking-wide text-primary uppercase md:text-5xl">
          {t("pageTitle")}
        </h1>
      </Container>

      {/* Hero, matching the home page's membership panel */}
      <section className="px-3 pt-6 md:px-5 md:pt-8">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
          <Container className="py-10 md:py-12">
            <p className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-extrabold tracking-wide text-accent-foreground uppercase">
              {tj("eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-wide break-words text-white uppercase md:text-5xl">
              {tj("heading")}
            </h2>
            <p className="mt-2 text-xl font-bold text-accent md:text-2xl">
              {tj("tagline")}
            </p>
            <p className="mt-4 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-white/90">
              {tj("text")}
            </p>
            <h3 className="mt-6 text-xl font-extrabold tracking-wide text-white uppercase md:text-2xl">
              {tj("subheading")}
            </h3>
            <p className="mt-2 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-white/90">
              {tj("subtext")}
            </p>
          </Container>
        </div>
      </section>
      <Container className="grid max-w-3xl gap-8 py-8">
        <section
          aria-labelledby="print-heading"
          className="rounded-2xl border-2 border-accent bg-accent/10 p-6 md:p-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <FileTextIcon
              className="size-14 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div className="flex-1">
              <h2
                id="print-heading"
                className="text-2xl font-extrabold tracking-wide uppercase"
              >
                {t("printHeading")}
              </h2>
              <p className="mt-2 max-w-none text-lg leading-relaxed">
                {t("printText")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("printNote")}
              </p>
            </div>
          </div>
          <a
            href="/forms/iwmpc-membership-application.pdf"
            download
            className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-bold text-white shadow-sm hover:bg-primary-dark md:inline-flex"
          >
            <DownloadIcon className="size-5" aria-hidden="true" />
            {t("printCta")}
          </a>
        </section>

        {/* Benefits, requirements, steps, dividend explainer and PMES schedule arrive in P4 */}
        <p className="rounded-xl border border-dashed bg-surface p-5 text-muted-foreground">
          {t("moreSoon")}
        </p>

        <section aria-labelledby="duties-heading">
          <h2
            id="duties-heading"
            className="text-2xl font-extrabold tracking-wide uppercase"
          >
            {t("dutiesHeading")}
          </h2>
          <p className="mt-3 max-w-none text-justify text-lg leading-relaxed hyphens-auto">
            {localized(duties, "intro", locale)}
          </p>
          <ol className="mt-6 grid gap-5">
            {duties.groups.map((group, i) => (
              <li key={i} className="rounded-2xl border bg-card p-5 shadow-sm">
                <h3 className="flex items-center gap-3 text-xl font-bold text-primary">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white"
                  >
                    {i + 1}
                  </span>
                  {localized(group, "title", locale)}
                </h3>
                <ul className="mt-4 grid gap-3">
                  {group.items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <ShieldCheckIcon
                        className="mt-1 size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <p className="max-w-none">
                        <strong>{localized(item, "title", locale)}:</strong>{" "}
                        {localized(item, "text", locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </>
  );
}
