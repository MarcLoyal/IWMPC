"use client";

import { MenuIcon, TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { primaryNav, REPORT_HREF } from "@/lib/site";
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
    "flex min-h-14 items-center rounded-lg px-3 text-lg font-semibold text-primary hover:bg-surface";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-surface min-[1220px]:hidden"
        >
          <MenuIcon className="size-7" aria-hidden="true" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent closeLabel={t("closeMenu")}>
        <SheetTitle className="font-heading text-xl font-bold text-primary">
          {t("menu")}
        </SheetTitle>
        <SheetDescription className="sr-only">{t("label")}</SheetDescription>
        <nav aria-label={t("label")}>
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.key}>
                <SheetClose asChild>
                  <Link href={item.href} className={linkClass}>
                    {t(item.key)}
                  </Link>
                </SheetClose>
                {item.children && (
                  <ul className="mb-2 ml-3 border-l-2 border-accent pl-2">
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <SheetClose asChild>
                          <Link
                            href={child.href}
                            className="flex min-h-12 items-center rounded-lg px-3 font-medium text-foreground hover:bg-surface"
                          >
                            {t(`sub.${child.key}`)}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                )}
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
