import type { Metadata } from "next";
import {
  CalculatorIcon,
  DropletIcon,
  FlaskConicalIcon,
  MapIcon,
  PlugIcon,
  TriangleAlertIcon,
  WalletIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { REPORT_HREF } from "@/lib/site";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { SupplyStatusBanner } from "@/components/site/supply-status-banner";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("water");
  return { title: t("title"), description: t("intro") };
}

const links = [
  { key: "advisories", href: "/water/advisories", icon: DropletIcon },
  { key: "rates", href: "/water/rates", icon: CalculatorIcon },
  { key: "pay", href: "/water/pay", icon: WalletIcon },
  { key: "newConnection", href: "/water/new-connection", icon: PlugIcon },
  { key: "report", href: REPORT_HREF, icon: TriangleAlertIcon },
  { key: "quality", href: "/water/quality", icon: FlaskConicalIcon },
  { key: "serviceArea", href: "/water/service-area", icon: MapIcon },
] as const;

export default async function WaterPage() {
  const t = await getTranslations("water");

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="py-8">
        <h2 className="text-2xl">{t("statusHeading")}</h2>
        <div className="mt-4">
          <SupplyStatusBanner variant="large" />
        </div>

        <h2 className="mt-10 text-2xl">{t("linksHeading")}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map(({ key, href, icon: Icon }) => (
            <li key={key}>
              <Link
                href={href}
                className="flex h-full gap-4 rounded-xl border bg-card p-5 shadow-sm hover:border-primary"
              >
                <Icon
                  className="mt-1 size-8 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="block font-heading text-xl font-bold text-primary">
                    {t(`links.${key}.title`)}
                  </span>
                  <span className="text-muted-foreground">
                    {t(`links.${key}.desc`)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
