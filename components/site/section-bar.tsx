import { ArrowRightIcon } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * A coloured title bar for a home-page section: icon and uppercase heading on
 * the left, an optional "see all" link on the right.
 */
export function SectionBar({
  id,
  title,
  icon: Icon,
  tone,
  action,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  tone: "red" | "blue";
  action?: { href: string; label: string };
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-white sm:px-5",
        tone === "red" ? "bg-brand-red" : "bg-primary",
      )}
    >
      <h2
        id={id}
        className="flex items-center gap-3 text-xl font-extrabold tracking-wide text-white uppercase sm:text-2xl"
      >
        <Icon className="size-7 shrink-0" aria-hidden="true" />
        {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-bold text-accent-foreground shadow-sm hover:brightness-95 sm:text-base"
        >
          {action.label}
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
