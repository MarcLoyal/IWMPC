"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { primaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Desktop navigation (from 1220px wide; narrower screens get the menu button).
 * Labels never wrap: sizes step up with the screen so the longer Filipino
 * labels stay on one line. Items with children drop down when the mouse moves over
 * them — no click needed — and also when reached with the keyboard. Escape
 * closes the open menu. Every parent is still a normal link to its own page,
 * so touch screens and browsers without JavaScript lose nothing.
 */
export function NavMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav
      aria-label={t("label")}
      className="mx-auto hidden pl-4 min-[1220px]:block min-[1366px]:pl-6 2xl:pl-8"
    >
      <ul className="flex items-center">
        {primaryNav.map((item) => {
          const isOpen = open === item.key;
          const linkClass =
            "inline-flex min-h-12 items-center gap-1 rounded-full px-1.5 text-[0.8rem] font-semibold whitespace-nowrap text-primary hover:bg-surface min-[1366px]:px-2 min-[1366px]:text-[0.9rem] 2xl:px-3 2xl:text-[0.95rem]";

          if (!item.children) {
            return (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {t(item.key)}
                </Link>
              </li>
            );
          }

          return (
            <li
              key={item.key}
              className="relative"
              onMouseEnter={() => setOpen(item.key)}
              onMouseLeave={() => setOpen(null)}
              onFocus={() => setOpen(item.key)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setOpen(null);
                  (
                    e.currentTarget.querySelector("a") as HTMLElement | null
                  )?.blur();
                }
              }}
            >
              <Link
                href={item.href}
                aria-expanded={isOpen}
                className={cn(linkClass, isOpen && "bg-surface")}
                onClick={() => setOpen(null)}
              >
                {t(item.key)}
                <ChevronDownIcon
                  className={cn(
                    "size-4 transition-transform",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </Link>
              {/* pt-2 bridges the gap so the menu does not close while the mouse travels down */}
              <div
                className={cn(
                  "absolute top-full left-0 z-50 pt-2",
                  isOpen ? "block" : "hidden",
                )}
              >
                <ul
                  aria-label={t("submenu", { name: t(item.key) })}
                  className="min-w-64 rounded-2xl border border-t-4 border-t-accent bg-background p-2 shadow-xl"
                >
                  {item.children.map((child) => (
                    <li key={child.key}>
                      <Link
                        href={child.href}
                        onClick={() => setOpen(null)}
                        className="flex min-h-12 items-center rounded-xl px-4 font-medium whitespace-nowrap text-foreground hover:bg-surface hover:text-primary"
                      >
                        {t(`sub.${child.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
