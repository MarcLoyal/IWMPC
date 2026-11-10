import { site } from "@/lib/site";

/** Lazy-loaded map, located by place name rather than hand-picked coordinates. */
export function MapEmbed({ title }: { title: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=15&output=embed`;
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="no-print aspect-[4/3] w-full rounded-xl border md:aspect-video"
    />
  );
}
