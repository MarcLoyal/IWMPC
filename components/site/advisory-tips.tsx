import { LightbulbIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function AdvisoryTips() {
  const t = useTranslations("advisories.tips");
  return (
    <aside className="rounded-xl border bg-surface p-5">
      <h2 className="flex items-center gap-2 text-xl">
        <LightbulbIcon className="size-6" aria-hidden="true" />
        {t("heading")}
      </h2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        <li>{t("store")}</li>
        <li>{t("flush")}</li>
      </ul>
    </aside>
  );
}
