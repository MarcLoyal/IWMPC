import { Suspense } from "react";
import Image from "next/image";
import { PhoneCallIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { site } from "@/lib/site";
import { LanguageToggle } from "./language-toggle";
import { MobileMenu } from "./mobile-menu";
import { NavMenu } from "./nav-menu";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="no-print sticky top-0 z-40 border-b bg-background/95 text-foreground shadow-sm backdrop-blur">
      <div className="site-header-inner mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link
          href="/"
          className="flex min-h-12 items-center gap-2 rounded-lg font-heading font-bold"
        >
          <Image
            src="/logo.png"
            alt=""
            width={56}
            height={56}
            priority
            className="size-11 rounded-full sm:size-14"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-2xl text-primary">{site.shortName}</span>
            <span className="hidden max-w-44 text-[0.65rem] leading-tight font-semibold tracking-wide text-muted-foreground uppercase sm:block lg:hidden 2xl:block">
              {site.legalName}
            </span>
          </span>
        </Link>

        <NavMenu />

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/* On tablet and up the language toggle lives in the top strip */}
          <div className="md:hidden">
            <Suspense fallback={null}>
              <LanguageToggle />
            </Suspense>
          </div>
          {site.phone && (
            <a
              href={`tel:${site.phoneTel}`}
              className="hidden items-center gap-3 rounded-xl bg-primary px-4 py-2.5 text-primary-foreground shadow-md hover:bg-primary-dark md:flex"
            >
              <PhoneCallIcon
                className="size-8 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold">{t("callUs")}</span>
                <span className="text-xl font-extrabold whitespace-nowrap">
                  {site.phone}
                </span>
              </span>
            </a>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
