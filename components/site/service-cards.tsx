import Image from "next/image";
import {
  ArrowRightIcon,
  DropletIcon,
  FlameIcon,
  HandshakeIcon,
  WheatIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";

const SERVICES = [
  {
    key: "water",
    href: "/water",
    icon: DropletIcon,
    badge: "bg-primary",
    image: "/images/collage/03-water-line-work.jpg",
  },
  {
    key: "rice",
    href: "/services/rice",
    icon: WheatIcon,
    badge: "bg-success",
    image: "/images/services/rice.jpg",
  },
  {
    key: "lpg",
    href: "/services/lpg",
    icon: FlameIcon,
    badge: "bg-brand-red",
    image: "/images/services/lpg.jpg",
  },
  {
    key: "loans",
    href: "/services/loans",
    icon: HandshakeIcon,
    badge: "bg-purple-700",
    image: "/images/services/loans-iwmpc.jpg",
  },
] as const;

/** Photo cards for the cooperative's four services, each with a "Learn more" button. */
export async function ServiceCards({
  headingLevel: Heading = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const t = await getTranslations("home.services");

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {SERVICES.map(({ key, href, icon: Icon, badge, image }) => (
        <li key={key}>
          <Link
            href={href}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-center shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <span
              className={`relative z-10 mx-auto -mt-8 flex size-16 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white ${badge}`}
            >
              <Icon className="size-8" aria-hidden="true" />
            </span>
            <div className="flex flex-1 flex-col items-center gap-1.5 px-5 pt-3 pb-5">
              <Heading className="text-xl font-bold text-foreground">
                {t(key)}
              </Heading>
              <p className="pb-3 text-muted-foreground">{t(`${key}Desc`)}</p>
              <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-6 font-bold text-accent-foreground shadow-sm transition group-hover:brightness-95">
                {t("more")}
                <ArrowRightIcon
                  className="size-4 transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
