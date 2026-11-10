"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations("language");
  const active = useLocale();
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "inline-flex overflow-hidden rounded-lg border border-white/50 text-sm font-semibold",
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
            "inline-flex min-h-12 min-w-12 items-center justify-center px-3 uppercase",
            locale === active
              ? "bg-white text-primary"
              : "text-white hover:bg-white/15",
          )}
        >
          {locale}
          <span className="sr-only"> — {t(locale)}</span>
        </Link>
      ))}
    </nav>
  );
}
