import type { Metadata } from "next";
import { PhoneCallIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { ReportForm } from "@/components/forms";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { Placeholder } from "@/components/site/placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("report");
  return { title: t("title"), description: t("intro") };
}

export default async function ReportPage() {
  const [t, tw] = await Promise.all([
    getTranslations("report"),
    getTranslations("water"),
  ]);
  // Until a separate emergency hotline is confirmed, the office number is the one to call.
  const hotline = site.emergencyHotline ?? site.phone;
  const hotlineTel = site.emergencyHotline ?? site.phoneTel;

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: tw("title"), href: "/water" }, { label: t("title") }]}
      />
      <Container className="grid max-w-3xl gap-8 py-8">
        <p className="flex max-w-none items-start gap-3 rounded-xl border-2 border-danger/40 bg-danger/10 p-4 text-lg">
          <PhoneCallIcon
            className="mt-1 size-6 shrink-0 text-danger-strong"
            aria-hidden="true"
          />
          <span>
            {t("emergency")}{" "}
            {hotline ? (
              <a
                href={`tel:${hotlineTel}`}
                className="font-bold whitespace-nowrap text-danger-strong underline underline-offset-4"
              >
                {hotline}
              </a>
            ) : (
              <Placeholder />
            )}
          </span>
        </p>
        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="mb-4 text-2xl">
            {t("formHeading")}
          </h2>
          <ReportForm />
        </section>
      </Container>
    </>
  );
}
