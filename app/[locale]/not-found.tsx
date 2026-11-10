import { DropletIcon, PhoneIcon, SearchXIcon, WalletIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/site/container";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <Container className="py-16 text-center">
      <SearchXIcon
        className="mx-auto size-16 text-primary"
        aria-hidden="true"
      />
      <h1 className="mt-4 text-3xl md:text-4xl">{t("title")}</h1>
      <p className="mx-auto mt-3 text-lg text-muted-foreground">{t("text")}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/water/advisories">
            <DropletIcon aria-hidden="true" />
            {t("status")}
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/water/pay">
            <WalletIcon aria-hidden="true" />
            {t("pay")}
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/contact">
            <PhoneIcon aria-hidden="true" />
            {t("contact")}
          </Link>
        </Button>
      </div>
      <p className="mx-auto mt-6">
        <Link
          href="/"
          className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4"
        >
          {t("home")}
        </Link>
      </p>
    </Container>
  );
}
