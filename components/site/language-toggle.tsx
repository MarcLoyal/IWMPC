"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  className,
  compact = false,
}: {
  className?: string;
  /** Smaller buttons for the top strip. */
  compact?: boolean;
}) {
  const t = useTranslations("language");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-border text-sm font-semibold",
        className,
      )}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          lang={locale}
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "inline-flex items-center justify-center px-3 uppercase",
            compact ? "min-h-8 min-w-10 text-xs" : "min-h-12 min-w-12",
            locale === active
              ? "bg-primary text-white"
              : "text-primary hover:bg-surface",
          )}
        >
          {locale}
          <span className="sr-only"> — {t(locale)}</span>
        </Link>
      ))}
    </nav>
  );
}
