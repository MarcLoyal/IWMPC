import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export type Crumb = { label: string; href?: string };

/** Home is added automatically; the last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations();
  const crumbs: Crumb[] = [{ label: t("common.home"), href: "/" }, ...items];

  return (
    <nav aria-label={t("breadcrumbs.label")} className="no-print text-sm">
      <ol className="flex flex-wrap items-center gap-x-1 text-muted-foreground">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="inline-flex min-h-12 items-center text-primary underline underline-offset-4"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className="inline-flex min-h-12 items-center"
                >
                  {crumb.label}
                </span>
              )}
              {!last && (
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
