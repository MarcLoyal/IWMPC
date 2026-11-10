"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { estimateLoan, loanInputErrors, type LoanEstimate } from "@/lib/loan";
import { Button } from "@/components/ui/button";
import { NumberField } from "./field";

export type EstimatorProduct = {
  id: string;
  name: string;
  max_amount?: number;
  max_term_months?: number;
  monthly_interest_percent?: number;
};

type Field = "principal" | "rate" | "term";

const toNumber = (s: string) => {
  const text = s.trim().replace(/,/g, "");
  return text === "" ? Number.NaN : Number(text);
};

/**
 * Flat-interest loan estimate (lib/loan.ts). With no confirmed loan products
 * the member types the rate themselves, so the page never asserts a rate the
 * cooperative has not published.
 */
export function LoanEstimator({ products }: { products: EstimatorProduct[] }) {
  const t = useTranslations("estimator");
  const format = useFormatter();

  const [productId, setProductId] = useState("");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [estimate, setEstimate] = useState<LoanEstimate | null>(null);

  const product = products.find((p) => p.id === productId);
  const money = (n: number) =>
    format.number(n, { style: "currency", currency: "PHP" });

  const edit = (set: (value: string) => void) => (value: string) => {
    set(value);
    setEstimate(null);
    setErrors({});
  };

  function chooseProduct(id: string) {
    setProductId(id);
    setEstimate(null);
    setErrors({});
    const next = products.find((p) => p.id === id);
    if (next?.monthly_interest_percent !== undefined) {
      setRate(String(next.monthly_interest_percent));
    }
  }

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const input = {
      principal: toNumber(amount),
      monthlyRatePercent: toNumber(rate),
      termMonths: toNumber(term),
    };
    const next: Partial<Record<Field, string>> = {};
    for (const field of loanInputErrors(input))
      next[field] = t(`errors.${field}`);

    if (
      !next.principal &&
      product?.max_amount &&
      input.principal > product.max_amount
    ) {
      next.principal = t("errors.maxAmount", {
        amount: money(product.max_amount),
      });
    }
    if (
      !next.term &&
      product?.max_term_months &&
      input.termMonths > product.max_term_months
    ) {
      next.term = t("errors.maxTerm", { months: product.max_term_months });
    }

    setErrors(next);
    setEstimate(Object.keys(next).length === 0 ? estimateLoan(input) : null);
  }

  return (
    <div className="rounded-2xl border-2 border-harvest/50 bg-card p-5 md:p-6">
      <form onSubmit={calculate} noValidate className="grid gap-5">
        {products.length > 0 && (
          <label className="flex flex-col font-semibold">
            <span className="mb-1">{t("product")}</span>
            <select
              value={productId}
              onChange={(e) => chooseProduct(e.target.value)}
              className="min-h-12 rounded-lg border border-muted-foreground/60 bg-background px-3 text-lg font-normal"
            >
              <option value="">{t("custom")}</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            label={t("amount")}
            value={amount}
            onChange={edit(setAmount)}
            error={errors.principal}
            decimal
          />
          <NumberField
            label={t("rate")}
            value={rate}
            onChange={edit(setRate)}
            error={errors.rate}
            decimal
          />
          <NumberField
            label={t("term")}
            value={term}
            onChange={edit(setTerm)}
            error={errors.term}
          />
        </div>
        <Button type="submit" size="lg" className="sm:justify-self-start">
          {t("compute")}
        </Button>
      </form>

      <div aria-live="polite" className="mt-6">
        {estimate && (
          <section
            aria-labelledby="loan-result"
            className="rounded-xl bg-surface p-5"
          >
            <h3 id="loan-result" className="text-xl">
              {t("result.heading")}
            </h3>
            <dl className="mt-3 grid gap-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <dt className="text-lg font-bold">{t("result.monthly")}</dt>
                <dd className="font-heading text-4xl font-bold whitespace-nowrap text-primary">
                  {money(estimate.monthlyAmortization)}
                </dd>
              </div>
              {(
                [
                  ["principal", estimate.principal],
                  ["interest", estimate.totalInterest],
                  ["total", estimate.totalPayable],
                ] as const
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-4 border-t pt-2"
                >
                  <dt>{t(`result.${key}`)}</dt>
                  <dd className="font-semibold whitespace-nowrap">
                    {money(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t("disclaimer")}</p>
    </div>
  );
}
