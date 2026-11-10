import type { Metadata } from "next";
import { InfoIcon, ScaleIcon } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { getLoans, localized } from "@/lib/content";
import { flags } from "@/lib/site";
import { LoanEstimator } from "@/components/calculators/loan-estimator";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { StepList } from "@/components/site/step-list";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("loans");
  return { title: t("title"), description: t("intro") };
}

export default async function LoansPage() {
  const [t, te, format, locale, loans] = await Promise.all([
    getTranslations("loans"),
    getTranslations("estimator"),
    getFormatter(),
    getLocale() as Promise<Locale>,
    getLoans(),
  ]);
  const money = (n: number) =>
    format.number(n, { style: "currency", currency: "PHP" });

  const products = loans.products.map((p) => ({
    ...p,
    name: localized(p, "name", locale),
    purpose: localized(p, "purpose", locale),
    eligibility: localized(p, "eligibility", locale),
    requirements:
      locale === "en" && p.requirements_en.length > 0
        ? p.requirements_en
        : p.requirements_fil,
  }));
  const ratesConfirmed = products.some(
    (p) => p.monthly_interest_percent !== undefined,
  );

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("services") }, { label: t("title") }]}
      />
      <Container className="grid gap-12 py-8">
        <section aria-labelledby="products-heading">
          <h2 id="products-heading" className="text-2xl">
            {t("productsHeading")}
          </h2>
          {products.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed bg-surface p-6 text-lg">
              {t("empty")}
            </p>
          ) : (
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {products.map((p) => (
                <li key={p.id} className="rounded-xl border bg-card p-5">
                  <h3 className="text-xl">{p.name}</h3>
                  {p.purpose && <p className="mt-1">{p.purpose}</p>}
                  <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
                    {p.max_amount !== undefined && (
                      <>
                        <dt className="font-semibold">{t("maxAmount")}</dt>
                        <dd>{money(p.max_amount)}</dd>
                      </>
                    )}
                    {p.max_term_months !== undefined && (
                      <>
                        <dt className="font-semibold">{t("term")}</dt>
                        <dd>{t("months", { count: p.max_term_months })}</dd>
                      </>
                    )}
                    {p.monthly_interest_percent !== undefined && (
                      <>
                        <dt className="font-semibold">{t("interest")}</dt>
                        <dd>
                          {t("perMonth", {
                            rate: format.number(p.monthly_interest_percent),
                          })}
                        </dd>
                      </>
                    )}
                    {p.eligibility && (
                      <>
                        <dt className="font-semibold">{t("eligibility")}</dt>
                        <dd>{p.eligibility}</dd>
                      </>
                    )}
                  </dl>
                  {p.requirements.length > 0 && (
                    <>
                      <h4 className="mt-3 font-sans text-base font-semibold text-foreground">
                        {t("requirements")}
                      </h4>
                      <ul className="mt-1 list-disc pl-6">
                        {p.requirements.map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {loans.steps.length > 0 && (
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-2xl">
              {t("stepsHeading")}
            </h2>
            {!loans.steps_confirmed && (
              <p className="mt-2 flex items-start gap-2 text-muted-foreground">
                <InfoIcon className="mt-1 size-5 shrink-0" aria-hidden="true" />
                {t("stepsUnconfirmed")}
              </p>
            )}
            <div className="mt-4 max-w-2xl">
              <StepList
                steps={loans.steps.map((s) => localized(s, "title", locale))}
              />
            </div>
            <p className="mt-4 flex items-start gap-2 font-semibold">
              <ScaleIcon
                className="mt-1 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              {t("approval")}
            </p>
          </section>
        )}

        {flags.show_loan_estimator && (
          <section aria-labelledby="estimator-heading">
            <h2 id="estimator-heading" className="text-2xl">
              {te("heading")}
            </h2>
            <p className="mt-2">{te("intro")}</p>
            {!ratesConfirmed && (
              <p className="mt-2 flex items-start gap-2 text-muted-foreground">
                <InfoIcon className="mt-1 size-5 shrink-0" aria-hidden="true" />
                {te("methodUnconfirmed")}
              </p>
            )}
            <div className="mt-4">
              <LoanEstimator
                products={products.map((p) => ({
                  id: p.id,
                  name: p.name,
                  max_amount: p.max_amount,
                  max_term_months: p.max_term_months,
                  monthly_interest_percent: p.monthly_interest_percent,
                }))}
              />
            </div>
          </section>
        )}

        <section aria-labelledby="inquiry-heading">
          <h2 id="inquiry-heading" className="text-2xl">
            {t("inquiryHeading")}
          </h2>
          {/* The loan inquiry form is built in P3 */}
          <p className="mt-3 rounded-xl border border-dashed bg-surface p-5 text-muted-foreground">
            {t("inquirySoon")}
          </p>
        </section>
      </Container>
    </>
  );
}
