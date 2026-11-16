import { TriangleAlertIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getAdvisoryViewer } from "@/lib/advisory-view";
import { activeAdvisories, getAdvisories } from "@/lib/content";
import { AdvisoryRow } from "@/components/site/advisory-row";
import { Container } from "@/components/site/container";
import { SectionBar } from "@/components/site/section-bar";

/**
 * The latest active advisories under a blue title bar, as shown on the home
 * page and the News & Events page.
 */
export async function AdvisoriesPanel({ limit = 3 }: { limit?: number }) {
  const [t, view, all] = await Promise.all([
    getTranslations("home.advisories"),
    getAdvisoryViewer(),
    getAdvisories(),
  ]);
  const advisories = activeAdvisories(all).slice(0, limit);

  return (
    <section aria-labelledby="advisories-heading">
      <div className="px-3 py-6 md:px-5 md:py-8">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl border bg-card shadow-sm">
          <SectionBar
            id="advisories-heading"
            title={t("heading")}
            icon={TriangleAlertIcon}
            action={{ href: "/water/advisories", label: t("viewAll") }}
          />
          {advisories.length === 0 ? (
            <Container className="py-6 text-lg">{t("none")}</Container>
          ) : (
            <ul className="divide-y divide-border">
              {advisories.map((a) => (
                <li key={a.slug}>
                  <AdvisoryRow advisory={view(a)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
