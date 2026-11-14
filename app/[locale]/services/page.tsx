import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { ServiceCards } from "@/components/site/service-cards";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("servicesPage");
  return { title: t("title"), description: t("intro") };
}

export default async function ServicesPage() {
  const t = await getTranslations("servicesPage");
  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="py-8">
        <ServiceCards headingLevel="h2" />
      </Container>
    </>
  );
}
