import {
  CalculatorIcon,
  DropletIcon,
  PhoneIcon,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { site } from "@/lib/site";

/** Sticky bottom bar, phones only: Status · Bill · Bayad · Tawag. */
export function MobileActionBar() {
  const t = useTranslations("actionBar");
  const itemClass =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-semibold text-primary hover:bg-surface";
  const iconClass = "size-6";

  return (
    <nav
      aria-label={t("label")}
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_8px_rgb(15_23_42/0.08)] md:hidden"
    >
      <ul className="flex">
        <li className="flex flex-1">
          <Link href="/water/advisories" className={itemClass}>
            <DropletIcon className={iconClass} aria-hidden="true" />
            {t("status")}
          </Link>
        </li>
        <li className="flex flex-1">
          <Link href="/water/rates" className={itemClass}>
            <CalculatorIcon className={iconClass} aria-hidden="true" />
            {t("bill")}
          </Link>
        </li>
        <li className="flex flex-1">
          <Link href="/water/pay" className={itemClass}>
            <WalletIcon className={iconClass} aria-hidden="true" />
            {t("pay")}
          </Link>
        </li>
        <li className="flex flex-1">
          {/* Dials directly once the cooperative confirms its number; until then, the contact page. */}
          {site.phone ? (
            <a href={`tel:${site.phone}`} className={itemClass}>
              <PhoneIcon className={iconClass} aria-hidden="true" />
              {t("call")}
            </a>
          ) : (
            <Link href="/contact" className={itemClass}>
              <PhoneIcon className={iconClass} aria-hidden="true" />
              {t("call")}
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
