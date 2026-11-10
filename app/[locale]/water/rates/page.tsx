import type { Metadata } from "next";
import { ClockIcon, ImageIcon } from "lucide-react";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { isPlaceholderRate } from "@/lib/billing";
import { getRates, localized } from "@/lib/content";
import { BillCalculator } from "@/components/calculators/bill-calculator";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { Placeholder } from "@/components/site/placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("rates");
  return { title: t("title"), description: t("intro") };
}

export default async function RatesPage() {
  const [t, tc, tw, format, locale, rates] = await Promise.all([
    getTranslations("rates"),
    getTranslations("calculator"),
    getTranslations("water"),
    getFormatter(),
    getLocale() as Promise<Locale>,
    getRates(),
  ]);

  const money = (n: number) =>
    format.number(n, { style: "currency", currency: "PHP" });
  /** A peso amount, or the placeholder chip while the figure is still 0. */
  const price = (n: number) => (n > 0 ? money(n) : <Placeholder />);

  const classes = rates.classes.map((cls) => ({
    ...cls,
    label: localized(cls, "label", locale),
  }));
  // The calculator only ever sees fully priced classes.
  const priced = classes.filter((cls) => !isPlaceholderRate(cls));

  const readingSchedule = localized(rates.billing, "reading_schedule", locale);
  const disconnection = localized(rates, "disconnection_policy", locale);

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: tw("title"), href: "/water" }, { label: t("title") }]}
      />
      <Container className="grid gap-12 py-8">
        <section aria-labelledby="calculator-heading">
          <h2 id="calculator-heading" className="mb-4 text-2xl">
            {tc("heading")}
          </h2>
          {priced.length > 0 ? (
            <BillCalculator classes={priced} />
          ) : (
            <div className="flex gap-4 rounded-2xl border-2 border-warning/60 bg-warning/15 p-5 md:p-6">
              <ClockIcon
                className="mt-1 size-8 shrink-0 text-warning-strong"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-xl text-foreground">
                  {t("comingSoon.title")}
                </h3>
                <p className="mt-2">{t("comingSoon.body")}</p>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="table-heading">
          <h2 id="table-heading" className="text-2xl">
            {t("tableHeading")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {rates.effective_date ? (
              t("effective", {
                date: format.dateTime(new Date(rates.effective_date), {
                  dateStyle: "long",
                }),
              })
            ) : (
              <>
                {t("effectiveTbd")} <Placeholder />
              </>
            )}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {classes.map((cls) => (
              <table
                key={cls.id}
                className="w-full overflow-hidden rounded-xl border text-left"
              >
                <caption className="bg-primary px-4 py-3 text-left font-heading text-lg font-bold text-primary-foreground">
                  <span className="sr-only">
                    {t("table.caption", { className: cls.label })}
                  </span>
                  <span aria-hidden="true">{cls.label}</span>
                </caption>
                <thead className="bg-surface">
                  <tr>
                    <th scope="col" className="px-4 py-2">
                      {t("table.bracket")}
                    </th>
                    <th scope="col" className="px-4 py-2 text-right">
                      {t("table.price")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <th scope="row" className="px-4 py-3 font-normal">
                      {t("table.minimum", { cu_m: cls.minimum_cu_m })}
                    </th>
                    <td className="px-4 py-3 text-right font-semibold">
                      {price(cls.minimum_charge)}
                    </td>
                  </tr>
                  {cls.tiers.map((tier) => (
                    <tr key={tier.from} className="border-t">
                      <th scope="row" className="px-4 py-3 font-normal">
                        {tier.to === null
                          ? t("table.above", { from: tier.from })
                          : t("table.range", { from: tier.from, to: tier.to })}
                      </th>
                      <td className="px-4 py-3 text-right font-semibold">
                        {tier.rate > 0 ? (
                          t("table.perCuM", { amount: money(tier.rate) })
                        ) : (
                          <Placeholder />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </section>

        <section aria-labelledby="fees-heading">
          <h2 id="fees-heading" className="text-2xl">
            {t("feesHeading")}
          </h2>
          <dl className="mt-4 grid gap-x-8 gap-y-3 rounded-xl border bg-card p-5 text-lg sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold">{t("fees.latePenalty")}</dt>
            <dd>
              {rates.other_fees.late_penalty_percent > 0 ? (
                `${format.number(rates.other_fees.late_penalty_percent)}%`
              ) : (
                <Placeholder />
              )}
            </dd>
            <dt className="font-semibold">{t("fees.reconnection")}</dt>
            <dd>{price(rates.other_fees.reconnection_fee)}</dd>
            <dt className="font-semibold">{t("fees.readingSchedule")}</dt>
            <dd>{readingSchedule || <Placeholder />}</dd>
            <dt className="font-semibold">{t("fees.dueDate")}</dt>
            <dd>
              {rates.billing.due_days_after_billing > 0 ? (
                t("fees.dueDays", {
                  days: rates.billing.due_days_after_billing,
                })
              ) : (
                <Placeholder />
              )}
            </dd>
            <dt className="font-semibold">{t("fees.disconnection")}</dt>
            <dd>{disconnection || <Placeholder />}</dd>
          </dl>
        </section>

        <section aria-labelledby="read-bill-heading">
          <h2 id="read-bill-heading" className="text-2xl">
            {t("readBill.heading")}
          </h2>
          <p className="mt-2">{t("readBill.body")}</p>
          <div className="mt-4 flex aspect-[4/3] max-w-xl flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-surface p-6 text-center text-muted-foreground">
            <ImageIcon className="size-12" aria-hidden="true" />
            <p>{t("readBill.imagePlaceholder")}</p>
          </div>
        </section>
      </Container>
    </>
  );
}
