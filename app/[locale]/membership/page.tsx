import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowLeftIcon,
  DownloadIcon,
  FileTextIcon,
  ShieldCheckIcon,
} from "lucide-react";
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
  const [t, tj, ta, locale, duties] = await Promise.all([
    getTranslations("membership"),
    getTranslations("home.join"),
    getTranslations("about"),
    getLocale() as Promise<Locale>,
    getMemberDuties(),
  ]);

  return (
    <>
      {/* Page title, above the hero panel */}
      <Container className="grid items-center gap-4 pt-6 md:grid-cols-[1fr_auto_1fr] md:pt-8">
        <Link
          href="/"
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-accent px-5 font-bold text-accent-foreground shadow-sm hover:brightness-95"
        >
          <ArrowLeftIcon className="size-5" aria-hidden="true" />
          {ta("backHome")}
        </Link>
        <h1 className="text-center text-3xl font-extrabold tracking-wide text-primary uppercase md:text-5xl">
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
      {/* If interested: same width as the panel above */}
      <div className="px-3 pt-6 md:px-5 md:pt-8">
        <section
          aria-labelledby="print-heading"
          className="mx-auto max-w-[88rem] rounded-3xl border-2 border-accent bg-accent/10"
        >
          <Container className="py-8 md:py-10">
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
                <p className="mt-2 max-w-none text-justify text-lg leading-relaxed hyphens-auto">
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
          </Container>
        </section>
      </div>

      {/* Duties: a band over the members' oath-taking photo, with the
          content on the same column as the panels above */}
      <div className="px-3 pt-6 pb-6 md:px-5 md:pt-8 md:pb-8">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-3xl">
          <Image
            src="/images/membership-oath.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-primary-dark/90 via-primary/85 to-primary-dark/95"
          />
          <Container className="relative py-10 md:py-14">
            <section aria-labelledby="duties-heading">
              <h2
                id="duties-heading"
                className="text-2xl font-extrabold tracking-wide text-white uppercase md:text-3xl"
              >
                {t("dutiesHeading")}
              </h2>
              <p className="mt-3 max-w-none text-justify text-lg leading-relaxed hyphens-auto text-white/90">
                {localized(duties, "intro", locale)}
              </p>
              <ol className="mt-6 grid gap-5">
                {duties.groups.map((group, i) => (
                  <li key={i} className="rounded-2xl bg-card p-5 shadow-lg">
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
                          <p className="max-w-none text-justify hyphens-auto">
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
        </div>
      </div>
    </>
  );
}
