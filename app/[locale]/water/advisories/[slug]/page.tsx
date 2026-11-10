import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, Share2Icon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { routing, type Locale } from "@/lib/i18n/routing";
import { getAdvisoryViewer } from "@/lib/advisory-view";
import { getAdvisories, getAdvisory, localized } from "@/lib/content";
import { site } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdvisoryStatusBadge } from "@/components/site/advisory-card";
import { AdvisoryTips } from "@/components/site/advisory-tips";
import { Container } from "@/components/site/container";
import { MarkdocContent } from "@/components/site/markdoc";
import { PageHeader } from "@/components/site/page-header";

type Props = PageProps<"/[locale]/water/advisories/[slug]">;

export async function generateStaticParams() {
  const advisories = await getAdvisories();
  return routing.locales.flatMap((locale) =>
    advisories.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const advisory = await getAdvisory(slug);
  if (!advisory) return {};
  return { title: localized(advisory, "title", locale as Locale) };
}

export default async function AdvisoryPage({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const advisory = await getAdvisory(slug);
  if (!advisory) notFound();

  const [t, tc, tw, view] = await Promise.all([
    getTranslations("advisories"),
    getTranslations("common"),
    getTranslations("water"),
    getAdvisoryViewer({ dateStyle: "full", timeStyle: "short" }),
  ]);

  const { title, when } = view(advisory);
  const body = localized(advisory, "body", locale);

  const path = `${locale === routing.defaultLocale ? "" : `/${locale}`}/water/advisories/${advisory.slug}`;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(site.url + path)}`;

  return (
    <article>
      <PageHeader
        title={title}
        crumbs={[
          { label: tw("title"), href: "/water" },
          { label: t("listHeading"), href: "/water/advisories" },
          { label: title },
        ]}
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <AdvisoryStatusBadge status={advisory.status} />
          <Badge>{t(`types.${advisory.type}`)}</Badge>
          {advisory.sample && <Badge tone="harvest">{tc("sample")}</Badge>}
        </div>
      </PageHeader>

      <Container className="grid gap-8 py-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <dl className="grid gap-x-6 gap-y-3 rounded-xl border bg-card p-5 text-lg sm:grid-cols-[auto_1fr]">
            <dt className="font-semibold">{t("when")}</dt>
            <dd>{when}</dd>
            {advisory.affected_areas.length > 0 && (
              <>
                <dt className="font-semibold">{t("areas")}</dt>
                <dd>{advisory.affected_areas.join(", ")}</dd>
              </>
            )}
          </dl>

          {body && (
            <div className="mt-6 text-lg">
              <MarkdocContent source={body} />
            </div>
          )}

          <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <Share2Icon aria-hidden="true" />
                {t("shareFacebook")}
              </a>
            </Button>
            {advisory.facebook_post_url && (
              <Button asChild variant="secondary">
                <a
                  href={advisory.facebook_post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon aria-hidden="true" />
                  {t("viewOnFacebook")}
                </a>
              </Button>
            )}
            <Button asChild variant="ghost">
              <Link href="/water/advisories">
                <ArrowLeftIcon aria-hidden="true" />
                {t("back")}
              </Link>
            </Button>
          </div>
        </div>

        <AdvisoryTips />
      </Container>
    </article>
  );
}
