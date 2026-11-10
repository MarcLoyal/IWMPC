import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { fontBody, fontHeading } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { MobileActionBar } from "@/components/site/mobile-action-bar";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("title"),
      template: `%s | ${site.shortName} Inicbulan, Bauan`,
    },
    description: t("description"),
  };
}

export const viewport: Viewport = {
  themeColor: "#0B4F8A",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      className={`${fontBody.variable} ${fontHeading.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only z-50 rounded-lg bg-white px-4 py-3 font-semibold text-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
          >
            {t("skipToContent")}
          </a>
          <Header />
          {/* SupplyStatusBanner mounts here in P1 */}
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <MobileActionBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
