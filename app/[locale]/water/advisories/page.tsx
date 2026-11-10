import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getAdvisoryViewer } from "@/lib/advisory-view";
import { getAdvisories } from "@/lib/content";
import { AdvisoryList } from "@/components/site/advisory-list";
import { AdvisoryTips } from "@/components/site/advisory-tips";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { SupplyStatusBanner } from "@/components/site/supply-status-banner";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("advisories");
  return { title: t("title"), description: t("intro") };
}

export default async function AdvisoriesPage() {
  const [t, tw, advisories, view] = await Promise.all([
    getTranslations("advisories"),
    getTranslations("water"),
    getAdvisories(),
    getAdvisoryViewer(),
  ]);

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: tw("title"), href: "/water" }, { label: t("title") }]}
      />
      <Container className="grid gap-10 py-8">
        <SupplyStatusBanner variant="large" />
        <section aria-labelledby="list-heading">
          <h2 id="list-heading" className="mb-4 text-2xl">
            {t("listHeading")}
          </h2>
          <AdvisoryList advisories={advisories.map(view)} />
        </section>
        <AdvisoryTips />
      </Container>
    </>
  );
}
