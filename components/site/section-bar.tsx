import { ArrowRightIcon } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/site/container";

/**
 * A blue title bar for a home-page section: icon and uppercase heading on
 * the left, an optional "see all" link on the right.
 */
export function SectionBar({
  id,
  title,
  icon: Icon,
  action,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  action?: { href: string; label: string };
}) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
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
      </Container>
    </div>
  );
}
