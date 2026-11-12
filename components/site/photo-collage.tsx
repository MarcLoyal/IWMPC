import { getLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";
import { getCollage, localized } from "@/lib/content";
import { site } from "@/lib/site";
import { CollageGallery } from "./collage-gallery";

/** Loads the collage from content/collage.yaml and hands plain data to the client view. */
export async function PhotoCollage() {
  const [collage, locale] = await Promise.all([
    getCollage(),
    getLocale() as Promise<Locale>,
  ]);

  const pictures = [collage.award, collage.trophy, ...collage.photos].map(
    (picture) => ({
      src: picture.image,
      width: picture.width,
      height: picture.height,
      focus: picture.focus,
      alt: localized(picture, "alt", locale),
    }),
  );

  return (
    <CollageGallery
      pictures={pictures}
      background={collage.background}
      year={site.founded.slice(0, 4)}
    />
  );
}
