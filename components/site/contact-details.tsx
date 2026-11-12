import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SirenIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";
import { OfficeHours } from "./office-hours";
import { Placeholder } from "./placeholder";

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-9">
      <dt className="text-sm font-semibold text-muted-foreground">
        <Icon
          className="absolute top-1 left-0 size-6 text-primary"
          aria-hidden="true"
        />
        {label}
      </dt>
      <dd className="text-lg">{children}</dd>
    </div>
  );
}

/** Address, hours and phone numbers. Unconfirmed values show a placeholder. */
export function ContactDetails({
  showHotline = false,
}: {
  showHotline?: boolean;
}) {
  const t = useTranslations();
  const linkClass = "font-semibold text-primary underline underline-offset-4";

  return (
    <dl className="grid gap-4">
      <Row icon={MapPinIcon} label={t("footer.address")}>
        {site.address}
      </Row>
      <Row icon={ClockIcon} label={t("footer.hours")}>
        <OfficeHours />
      </Row>
      <Row icon={PhoneIcon} label={t("footer.phone")}>
        {site.phone ? (
          <a href={`tel:${site.phoneTel}`} className={linkClass}>
            {site.phone}
          </a>
        ) : (
          <Placeholder />
        )}
      </Row>
      {showHotline && (
        <Row icon={SirenIcon} label={t("contact.emergency")}>
          {site.hotline ? (
            <a href={`tel:${site.hotlineTel}`} className={linkClass}>
              {site.hotline}
            </a>
          ) : (
            <Placeholder />
          )}
        </Row>
      )}
      <Row icon={MailIcon} label={t("footer.email")}>
        {site.email ? (
          <a href={`mailto:${site.email}`} className={linkClass}>
            {site.email}
          </a>
        ) : (
          <Placeholder />
        )}
      </Row>
    </dl>
  );
}
