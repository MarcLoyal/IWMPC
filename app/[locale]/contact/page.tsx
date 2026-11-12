import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import { ContactForm } from "@/components/forms";
import { ContactDetails } from "@/components/site/contact-details";
import { Container } from "@/components/site/container";
import { MapEmbed } from "@/components/site/map-embed";
import { PageHeader } from "@/components/site/page-header";
import { Placeholder } from "@/components/site/placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("title"), description: t("intro") };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const linkClass = "font-semibold text-primary underline underline-offset-4";

  return (
    <>
      <PageHeader
        title={t("title")}
        intro={t("intro")}
        crumbs={[{ label: t("title") }]}
      />
      <Container className="grid gap-10 py-8 lg:grid-cols-2">
        <section aria-labelledby="office-heading">
          <h2 id="office-heading" className="text-2xl">
            {t("officeHeading")}
          </h2>
          <div className="mt-4">
            <ContactDetails showHotline />
          </div>
          <dl className="mt-6 grid gap-2 text-lg sm:grid-cols-[auto_1fr] sm:gap-x-4">
            <dt className="font-semibold">{t("facebook")}</dt>
            <dd>
              {site.facebookUrl ? (
                <a href={site.facebookUrl} rel="noopener" className={linkClass}>
                  Facebook
                </a>
              ) : (
                <Placeholder />
              )}
            </dd>
            <dt className="font-semibold">{t("messenger")}</dt>
            <dd>
              {site.messengerUrl ? (
                <a
                  href={site.messengerUrl}
                  rel="noopener"
                  className={linkClass}
                >
                  Messenger
                </a>
              ) : (
                <Placeholder />
              )}
            </dd>
          </dl>

          <h2 className="mt-10 text-2xl">{t("formHeading")}</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </section>

        <section aria-labelledby="map-heading">
          <h2 id="map-heading" className="text-2xl">
            {t("mapHeading")}
          </h2>
          <div className="mt-4">
            <MapEmbed title={t("mapTitle")} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t("mapNote")}</p>
        </section>
      </Container>
    </>
  );
}
