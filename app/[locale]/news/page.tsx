import type { Metadata } from "next";
import { ArrowLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { AdvisoriesPanel } from "@/components/site/advisories-panel";
import { Container } from "@/components/site/container";
import { HeroNews } from "@/components/site/hero-news";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("newsPage");
  return { title: t("title"), description: t("intro") };
}

/** News & Events: the latest news item and the current advisories. */
export default async function NewsPage() {
  const [t, ta] = await Promise.all([
    getTranslations("newsPage"),
    getTranslations("about"),
  ]);

  return (
    <>
      <Container className="grid items-center gap-4 pt-6 md:grid-cols-[1fr_auto_1fr] md:pt-8">
        <Link
          href="/"
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-accent px-5 font-bold text-accent-foreground shadow-sm hover:brightness-95"
        >
          <ArrowLeftIcon className="size-5" aria-hidden="true" />
          {ta("backHome")}
        </Link>
        <h1 className="text-center text-3xl font-extrabold tracking-wide text-primary uppercase md:text-5xl">
          {t("title")}
        </h1>
      </Container>

      {/* Latest news, the same panel as on the home page */}
      <section className="px-3 pt-6 md:px-5 md:pt-8">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark text-white">
          <Container className="py-10 md:py-12">
            <HeroNews />
          </Container>
        </div>
      </section>

      <AdvisoriesPanel />
    </>
  );
}
