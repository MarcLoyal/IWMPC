import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/site/container";

const AGENCIES = [
  { key: "doh", src: "/images/agencies/doh.png", w: 360, h: 360 },
  { key: "denr", src: "/images/agencies/denr.png", w: 360, h: 360 },
  // NWRB's mark has no outer ring, so it is drawn smaller to look balanced.
  {
    key: "nwrb",
    src: "/images/agencies/nwrb.png",
    w: 480,
    h: 333,
    small: true,
  },
  { key: "cda", src: "/images/agencies/cda.png", w: 360, h: 360 },
  { key: "bir", src: "/images/agencies/bir.png", w: 360, h: 360 },
  { key: "doe", src: "/images/agencies/doe.png", w: 360, h: 360, square: true },
  {
    key: "denrMark",
    src: "/images/agencies/denr-mark.png",
    w: 283,
    h: 282,
    small: true,
  },
  { key: "bauan", src: "/images/agencies/bauan.png", w: 360, h: 359 },
] as const;

// Each half of the moving strip holds the list this many times, so a half is
// always wider than the panel and the loop never shows a gap.
const REPEAT = 2;

/**
 * A strip of government agency and regulator logos that scrolls continuously
 * from right to left. Hovering, tapping or focusing a logo stops the strip and
 * shows the agency name under it. The strip is two identical halves; it slides by one
 * half and starts again, so the loop is seamless. Only the first set of logos
 * is read by screen readers. With reduced motion it stays still and wraps.
 */
export async function AgencyLogos() {
  const t = await getTranslations("home.agencies");

  const half = (copy: number) => (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-8 motion-reduce:px-4 md:gap-16 md:pr-16"
      aria-hidden={copy > 0 ? true : undefined}
    >
      {Array.from({ length: REPEAT }, (_, r) =>
        AGENCIES.map((a) => {
          const hidden = copy > 0 || r > 0;
          return (
            <li
              key={`${r}-${a.key}`}
              aria-hidden={!copy && r > 0 ? true : undefined}
              className={`shrink-0 ${r > 0 ? "motion-reduce:hidden" : ""}`}
            >
              {/* Hover, tap or focus a logo to see its name; the strip stops meanwhile. */}
              <button
                type="button"
                tabIndex={hidden ? -1 : undefined}
                className="group/logo relative flex h-20 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary md:h-24"
              >
                <Image
                  src={a.src}
                  alt={hidden ? "" : t(a.key)}
                  width={a.w}
                  height={a.h}
                  className={`w-auto transition group-hover/logo:scale-110 group-focus/logo:scale-110 ${
                    "small" in a
                      ? "h-12 md:h-14"
                      : "square" in a
                        ? "h-[4.5rem] rounded-xl md:h-[5.5rem]"
                        : "h-20 md:h-24"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-full left-1/2 mt-2 w-max max-w-[14rem] -translate-x-1/2 rounded-lg bg-primary-dark px-3 py-1.5 text-center text-sm leading-tight font-semibold text-white opacity-0 shadow-md transition group-hover/logo:opacity-100 group-focus/logo:opacity-100"
                >
                  {t(a.key)}
                </span>
              </button>
            </li>
          );
        }),
      )}
    </ul>
  );

  return (
    <section aria-labelledby="agencies-heading">
      <div className="px-3 pb-6 md:px-5 md:pb-8">
        <div className="mx-auto max-w-[88rem] overflow-hidden rounded-3xl border bg-card shadow-sm">
          <Container className="pt-7 text-center">
            <h2
              id="agencies-heading"
              className="text-2xl font-extrabold tracking-wide text-primary uppercase md:text-3xl lg:text-4xl"
            >
              {t("heading")}
            </h2>
          </Container>
          <div className="logo-marquee-wrap relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] pt-7 pb-16">
            <div className="logo-marquee flex w-max motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
              {half(0)}
              <div className="contents motion-reduce:hidden">{half(1)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
