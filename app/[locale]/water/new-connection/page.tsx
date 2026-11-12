import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConnectionForm } from "@/components/forms";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { Placeholder } from "@/components/site/placeholder";
import { StepList } from "@/components/site/step-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("connection");
  return { title: t("title"), description: t("intro") };
}

const STEPS = [
  "inquire",
  "requirements",
  "inspection",
  "fees",
  "installation",
  "activation",
] as const;

export default async function NewConnectionPage() {
  const [t, tw] = await Promise.all([
    getTranslations("connection"),
    getTranslations("water"),
  ]);

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: tw("title"), href: "/water" }, { label: t("title") }]}
      />
      <Container className="grid gap-12 py-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="mb-4 text-2xl">
              {t("stepsHeading")}
            </h2>
            <StepList steps={STEPS.map((s) => t(`steps.${s}`))} />
          </section>

          <div className="grid content-start gap-10">
            {/* Requirements, fees and the PDF form are still to come from the cooperative */}
            <section aria-labelledby="requirements-heading">
              <h2 id="requirements-heading" className="text-2xl">
                {t("requirementsHeading")}
              </h2>
              <p className="mt-3 text-lg">
                {t("requirementsTbd")} <Placeholder />
              </p>
            </section>
            <section aria-labelledby="fees-heading">
              <h2 id="fees-heading" className="text-2xl">
                {t("feesHeading")}
              </h2>
              <dl className="mt-3 grid gap-x-8 gap-y-3 rounded-xl border bg-card p-5 text-lg sm:grid-cols-[auto_1fr]">
                <dt className="font-semibold">{t("fees")}</dt>
                <dd>
                  <Placeholder />
                </dd>
                <dt className="font-semibold">{t("processing")}</dt>
                <dd>
                  <Placeholder />
                </dd>
                <dt className="font-semibold">{t("formPdf")}</dt>
                <dd>
                  <Placeholder />
                </dd>
              </dl>
            </section>
          </div>
        </div>

        <section aria-labelledby="form-heading" className="max-w-3xl">
          <h2 id="form-heading" className="mb-4 text-2xl">
            {t("formHeading")}
          </h2>
          <ConnectionForm />
        </section>
      </Container>
    </>
  );
}
