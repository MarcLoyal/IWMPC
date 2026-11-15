import type { Metadata } from "next";
import { ShieldCheckIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { getMemberDuties, localized } from "@/lib/content";
import { MembershipForm } from "@/components/forms";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("membership");
  return { title: t("title"), description: t("intro") };
}

export default async function MembershipPage() {
  const [t, locale, duties] = await Promise.all([
    getTranslations("membership"),
    getLocale() as Promise<Locale>,
    getMemberDuties(),
  ]);

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="grid max-w-3xl gap-8 py-8">
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

        {/* Benefits, requirements, steps, dividend explainer and PMES schedule arrive in P4 */}
        <p className="rounded-xl border border-dashed bg-surface p-5 text-muted-foreground">
          {t("moreSoon")}
        </p>
        <section
          id="inquire"
          aria-labelledby="form-heading"
          className="scroll-mt-28"
        >
          <h2 id="form-heading" className="mb-4 text-2xl">
            {t("formHeading")}
          </h2>
          <MembershipForm />
        </section>
      </Container>
    </>
  );
}
