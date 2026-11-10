import { HardHatIcon } from "lucide-react";
import { useTranslations } from "next-intl";

// P0 shell only — the real home page (hero, quick actions, advisories…) lands in P1.
export default function HomePage() {
  const t = useTranslations("home");

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1 className="max-w-3xl text-4xl md:text-5xl">{t("heroTitle")}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{t("heroText")}</p>
        <p className="mt-8 flex items-start gap-3 rounded-xl border bg-background p-4">
          <HardHatIcon
            className="mt-0.5 size-6 shrink-0 text-harvest-strong"
            aria-hidden="true"
          />
          <span>{t("underConstruction")}</span>
        </p>
      </div>
    </section>
  );
}
