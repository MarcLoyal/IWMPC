import { ConstructionIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

/** Shown on every page until `site.placeholderContent` is switched off at launch. */
export function PreviewStrip() {
  const t = useTranslations("preview");
  if (!site.placeholderContent) return null;
  return (
    <p className="no-print flex max-w-none items-center justify-center gap-2 bg-foreground px-4 py-1.5 text-center text-sm text-white">
      <ConstructionIcon className="size-4 shrink-0" aria-hidden="true" />
      {t("strip")}
    </p>
  );
}
