import { BadgeCheckIcon, MapPinIcon, PhoneIcon, UsersIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { Container } from "./container";

/** Slim strip of key facts above the header (tablet and up). */
export function InfoStrip() {
  const t = useTranslations("infoStrip");
  const item = "flex items-center gap-2";
  const icon = "size-4 shrink-0 text-accent";

  return (
    <div className="no-print hidden bg-primary-dark text-sm text-white md:block">
      <Container>
        <ul className="flex flex-wrap items-center justify-between gap-x-6 py-1">
          <li className={item}>
            <UsersIcon className={icon} aria-hidden="true" />
            {t("memberOwned", { year: site.founded.slice(0, 4) })}
          </li>
          <li className={item}>
            <BadgeCheckIcon className={icon} aria-hidden="true" />
            {t("cda", { number: site.cdaRegistrationNo })}
          </li>
          <li className={`${item} hidden lg:flex`}>
            <MapPinIcon className={icon} aria-hidden="true" />
            {site.address}
          </li>
          {site.phone && (
            <li>
              <a
                href={`tel:${site.phoneTel}`}
                className={`${item} min-h-9 font-semibold underline-offset-4 hover:underline`}
              >
                <PhoneIcon className={icon} aria-hidden="true" />
                {site.phone}
              </a>
            </li>
          )}
        </ul>
      </Container>
    </div>
  );
}
