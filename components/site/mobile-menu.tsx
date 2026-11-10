"use client";

import { MenuIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { primaryNav, secondaryNav, REPORT_HREF } from "@/lib/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileMenu() {
  const t = useTranslations("nav");
  const linkClass =
    "flex min-h-14 items-center rounded-lg px-3 text-lg font-semibold text-foreground hover:bg-surface";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-surface lg:hidden"
        >
          <MenuIcon className="size-7" aria-hidden="true" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent closeLabel={t("closeMenu")}>
        <SheetTitle className="font-heading text-xl font-bold text-foreground">
          {t("menu")}
        </SheetTitle>
        <SheetDescription className="sr-only">{t("label")}</SheetDescription>
        <nav aria-label={t("label")}>
          <ul className="flex flex-col">
            {[...primaryNav, ...secondaryNav].map((item) => (
              <li key={item.key}>
                <SheetClose asChild>
                  <Link href={item.href} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <SheetClose asChild>
          <Button asChild size="lg" variant="destructive">
            <Link href={REPORT_HREF}>
              <TriangleAlertIcon aria-hidden="true" />
              {t("report")}
            </Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
