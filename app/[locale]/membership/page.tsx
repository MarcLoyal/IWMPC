import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MembershipForm } from "@/components/forms";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("membership");
  return { title: t("title"), description: t("intro") };
}

export default async function MembershipPage() {
  const t = await getTranslations("membership");

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="grid max-w-3xl gap-8 py-8">
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
