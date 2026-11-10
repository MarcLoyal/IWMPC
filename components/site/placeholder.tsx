import { useTranslations } from "next-intl";

/** Visible marker for facts the cooperative has not confirmed yet. */
export function Placeholder() {
  const t = useTranslations("common");
  return (
    <span
      data-placeholder
      className="rounded border border-dashed border-current px-1.5 py-0.5 text-[0.85em] italic"
    >
      {t("toBeConfirmed")}
    </span>
  );
}
