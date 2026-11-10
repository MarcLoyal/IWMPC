import type { Metadata } from "next";
import { InfoIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { Placeholder } from "@/components/site/placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: t("title"), description: t("intro") };
}

const COLLECT = [
  "identity",
  "location",
  "account",
  "message",
  "photo",
] as const;
const RIGHTS = ["informed", "access", "rectify", "erase", "complain"] as const;

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");
  const list = "mt-3 list-disc space-y-1 pl-6";

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="grid max-w-3xl gap-8 py-8 text-lg">
        {site.placeholderContent && (
          <p className="flex gap-3 rounded-xl border border-warning/60 bg-warning/15 p-4 text-base">
            <InfoIcon
              className="mt-0.5 size-6 shrink-0 text-warning-strong"
              aria-hidden="true"
            />
            {t("draft")}
          </p>
        )}

        <section>
          <h2 className="text-2xl">{t("collect.title")}</h2>
          <p className="mt-3">{t("collect.body")}</p>
          <ul className={list}>
            {COLLECT.map((k) => (
              <li key={k}>{t(`collect.items.${k}`)}</li>
            ))}
          </ul>
          <p className="mt-3">{t("collect.analytics")}</p>
        </section>

        <section>
          <h2 className="text-2xl">{t("purpose.title")}</h2>
          <p className="mt-3">{t("purpose.body")}</p>
        </section>

        <section>
          <h2 className="text-2xl">{t("recipients.title")}</h2>
          <p className="mt-3">{t("recipients.body")}</p>
        </section>

        <section>
          <h2 className="text-2xl">{t("retention.title")}</h2>
          <p className="mt-3">
            {t("retention.body")} <Placeholder />
          </p>
        </section>

        <section>
          <h2 className="text-2xl">{t("rights.title")}</h2>
          <p className="mt-3">{t("rights.body")}</p>
          <ul className={list}>
            {RIGHTS.map((k) => (
              <li key={k}>{t(`rights.items.${k}`)}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl">{t("dpo.title")}</h2>
          <p className="mt-3">
            {t("dpo.body")} <Placeholder />
          </p>
          <p className="mt-3">
            {site.legalName}
            <br />
            {site.address}
          </p>
        </section>
      </Container>
    </>
  );
}
