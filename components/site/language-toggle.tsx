"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
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
  // Shown English first, then Filipino, with each language written out in full.
  const order: Locale[] = ["en", "fil"];

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-border text-sm font-semibold",
        className,
      )}
    >
      {order.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          lang={locale}
          aria-current={locale === active ? "true" : undefined}
          className={cn(
            "inline-flex items-center justify-center",
            compact
              ? "min-h-8 px-3 text-xs"
              : "min-h-12 px-2.5 text-xs sm:px-3 sm:text-sm",
            locale === active
              ? "bg-primary text-white"
              : "text-primary hover:bg-surface",
          )}
        >
          {t(locale)}
        </Link>
      ))}
    </nav>
  );
}
