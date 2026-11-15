import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/container";

const AGENCIES = [
  {
    key: "doh",
    src: "/images/agencies/doh.png",
    width: 360,
    height: 360,
    size: "h-20 md:h-24",
  },
  // DENR and NWRB have no outer ring, so they are drawn a little smaller to
  // look the same size as the seals.
  {
    key: "denr",
    src: "/images/agencies/denr.png",
    width: 283,
    height: 282,
    size: "h-16 md:h-20",
  },
  {
    key: "nwrb",
    src: "/images/agencies/nwrb.png",
    width: 480,
    height: 333,
    size: "h-12 md:h-14",
  },
  {
    key: "cda",
    src: "/images/agencies/cda.png",
    width: 360,
    height: 360,
    size: "h-20 md:h-24",
  },
  {
    key: "bauan",
    src: "/images/agencies/bauan.png",
    width: 360,
    height: 359,
    size: "h-20 md:h-24",
  },
] as const;

/**
 * A strip of accreditation and compliance agency logos that scrolls slowly
 * from right to left. The list is drawn twice so the loop has no gap; the
 * second copy is hidden from screen readers. With reduced motion it stays
 * still and wraps instead.
 */
export async function AgencyLogos() {
  const t = await getTranslations("home.agencies");

  const list = (copy: number) => (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-8 motion-reduce:px-4 md:gap-16 md:pr-16"
      aria-hidden={copy > 0 ? true : undefined}
    >
      {AGENCIES.map(({ key, src, width, height, size }) => (
        <li key={key} className="flex h-20 shrink-0 items-center md:h-24">
          <Image
            src={src}
            alt={copy > 0 ? "" : t(key)}
            title={t(key)}
            width={width}
            height={height}
            className={`${size} w-auto`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="agencies-heading">
      <div className="px-3 pb-6 md:px-5 md:pb-8">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl border bg-card shadow-sm">
          <Container className="pt-6 text-center">
            <h2
              id="agencies-heading"
              className="text-xl font-extrabold tracking-wide text-primary uppercase md:text-2xl"
            >
              {t("heading")}
            </h2>
            <p className="mx-auto mt-1 text-muted-foreground">{t("text")}</p>
          </Container>
          <div className="logo-marquee-wrap relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] py-6">
            <div className="logo-marquee flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
              {list(0)}
              <div className="contents motion-reduce:hidden">{list(1)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
