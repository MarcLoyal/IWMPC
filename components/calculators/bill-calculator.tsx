"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  computeBill,
  consumptionFromReadings,
  parseCubicMeters,
  type Bill,
  type RateClass,
  type ReadingError,
} from "@/lib/billing";
import { Button } from "@/components/ui/button";
import { ChoiceGroup, NumberField } from "./field";

export type CalculatorClass = RateClass & { label: string };

type Mode = "readings" | "direct";
type Errors = Partial<Record<"previous" | "current" | "used", ReadingError>>;

/**
 * Estimates a water bill from two meter readings or from cubic metres used.
 * Runs entirely in the browser; the arithmetic lives in lib/billing.ts.
 * Only render this with fully priced classes — never placeholder rates.
 */
export function BillCalculator({ classes }: { classes: CalculatorClass[] }) {
  const t = useTranslations("calculator");
  const tr = useTranslations("rates.table");
  const format = useFormatter();

  const [classId, setClassId] = useState(classes[0].id);
  const [mode, setMode] = useState<Mode>("readings");
  const [previous, setPrevious] = useState("");
  const [current, setCurrent] = useState("");
  const [used, setUsed] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [bill, setBill] = useState<Bill | null>(null);

  const cls = classes.find((c) => c.id === classId) ?? classes[0];
  const money = (n: number) =>
    format.number(n, { style: "currency", currency: "PHP" });
  const err = (e?: ReadingError) => (e ? t(`errors.${e}`) : undefined);

  // Any change to the inputs clears the old result so it can never be stale.
  const edit =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setBill(null);
      setErrors({});
    };

  function calculate(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    let consumption: number | undefined;

    if (mode === "direct") {
      const u = parseCubicMeters(used);
      if (u.ok) consumption = u.value;
      else next.used = u.error;
    } else {
      const p = parseCubicMeters(previous);
      const c = parseCubicMeters(current);
      if (!p.ok) next.previous = p.error;
      if (!c.ok) next.current = c.error;
      if (p.ok && c.ok) {
        const diff = consumptionFromReadings(p.value, c.value);
        if (diff.ok) consumption = diff.value;
        else next.current = diff.error;
      }
    }

    setErrors(next);
    setBill(consumption === undefined ? null : computeBill(cls, consumption));
  }

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 md:p-6">
      <form onSubmit={calculate} noValidate className="grid gap-5">
        {classes.length > 1 && (
          <ChoiceGroup
            legend={t("consumerClass")}
            name="consumer-class"
            value={classId}
            onChange={edit(setClassId)}
            options={classes.map((c) => ({ value: c.id, label: c.label }))}
          />
        )}
        <ChoiceGroup
          legend={t("mode")}
          name="entry-mode"
          value={mode}
          onChange={edit(setMode)}
          options={[
            { value: "readings", label: t("modeReadings") },
            { value: "direct", label: t("modeDirect") },
          ]}
        />

        {mode === "readings" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label={t("previous")}
              hint={t("hintWhole")}
              value={previous}
              onChange={edit(setPrevious)}
              error={err(errors.previous)}
            />
            <NumberField
              label={t("current")}
              hint={t("hintWhole")}
              value={current}
              onChange={edit(setCurrent)}
              error={err(errors.current)}
            />
          </div>
        ) : (
          <NumberField
            label={t("used")}
            hint={t("hintWhole")}
            value={used}
            onChange={edit(setUsed)}
            error={err(errors.used)}
          />
        )}

        <Button type="submit" size="lg" className="sm:justify-self-start">
          {t("compute")}
        </Button>
      </form>

      <div aria-live="polite" className="mt-6">
        {bill && (
          <section
            aria-labelledby="bill-result"
            className="rounded-xl bg-surface p-5"
          >
            <h3 id="bill-result" className="text-xl">
              {t("result.heading")}
            </h3>
            <dl className="mt-3 grid gap-2">
              <div className="flex justify-between gap-4">
                <dt>{t("result.consumption")}</dt>
                <dd className="font-semibold">
                  {t("result.cuM", { value: format.number(bill.consumption) })}
                </dd>
              </div>
              {bill.lines.map((line, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-4 border-t pt-2"
                >
                  <dt>
                    {line.kind === "minimum"
                      ? t("result.minimum", { cu_m: cls.minimum_cu_m })
                      : t("result.tier", {
                          cu_m: format.number(line.cu_m),
                          rate: money(line.rate),
                          range:
                            line.to === null
                              ? tr("above", { from: line.from })
                              : tr("range", { from: line.from, to: line.to }),
                        })}
                  </dt>
                  <dd className="font-semibold whitespace-nowrap">
                    {money(line.amount)}
                  </dd>
                </div>
              ))}
              <div className="flex flex-col gap-1 border-t-2 border-primary pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <dt className="text-lg font-bold">{t("result.total")}</dt>
                <dd className="font-heading text-4xl font-bold whitespace-nowrap text-primary">
                  {money(bill.total)}
                </dd>
              </div>
            </dl>
          </section>
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t("disclaimer")}</p>
    </div>
  );
}
