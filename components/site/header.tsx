import { Suspense } from "react";
import Image from "next/image";
import { TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { primaryNav, REPORT_HREF, site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="no-print sticky top-0 z-40 border-b bg-background/95 text-foreground backdrop-blur">
      <div className="site-header-inner mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Link
          href="/"
          className="flex min-h-12 items-center gap-2 rounded-lg font-heading font-bold"
        >
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            priority
            className="size-11 rounded-full sm:size-12"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-xl">{site.shortName}</span>
            <span className="hidden text-xs font-medium text-muted-foreground xl:block">
              {site.legalName}
            </span>
          </span>
        </Link>

        <nav aria-label={t("label")} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-12 items-center rounded-lg px-3 font-medium text-foreground/80 hover:bg-surface hover:text-foreground"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Suspense fallback={null}>
            <LanguageToggle />
          </Suspense>
          <Button asChild className="hidden sm:inline-flex">
            <Link href={REPORT_HREF}>
              <TriangleAlertIcon aria-hidden="true" />
              {t("report")}
            </Link>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
