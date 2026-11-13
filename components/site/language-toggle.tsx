"use client";

import { GlobeIcon } from "lucide-react";
import { Fragment } from "react";
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
        "inline-flex items-center gap-1 font-semibold text-primary sm:gap-1.5",
        compact ? "text-xs" : "text-[0.8rem] sm:text-sm",
        className,
      )}
    >
      <GlobeIcon
        className={cn(
          "shrink-0",
          compact ? "size-4" : "hidden size-4 min-[400px]:block sm:size-5",
        )}
        aria-hidden="true"
      />
      {order.map((locale, i) => (
        <Fragment key={locale}>
          {i > 0 && (
            <span className="text-muted-foreground" aria-hidden="true">
              |
            </span>
          )}
          <Link
            href={pathname}
            locale={locale}
            lang={locale}
            aria-current={locale === active ? "true" : undefined}
            className={cn(
              "inline-flex items-center px-0.5 underline-offset-4 sm:px-1",
              compact ? "min-h-8" : "min-h-12",
              locale === active
                ? "font-extrabold underline decoration-2"
                : "font-medium text-foreground/80 hover:text-primary hover:underline",
            )}
          >
            {t(locale)}
          </Link>
        </Fragment>
      ))}
    </nav>
  );
}
