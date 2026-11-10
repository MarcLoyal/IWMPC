import { PHOTO_MAX_BYTES } from "@/lib/forms/definitions";

export type ImageCheck =
  | { ok: true; contentType: string; extension: string }
  | { ok: false; error: "photoTooLarge" | "photoType" };

/**
 * Accepts JPEG, PNG and WebP only, identified by the file's first bytes —
 * the browser-supplied MIME type and file name are not trusted.
 */
export function checkImage(bytes: Uint8Array): ImageCheck {
  if (bytes.byteLength > PHOTO_MAX_BYTES)
    return { ok: false, error: "photoTooLarge" };

  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts(0xff, 0xd8, 0xff))
    return { ok: true, contentType: "image/jpeg", extension: "jpg" };
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
    return { ok: true, contentType: "image/png", extension: "png" };
  }
  const ascii = (from: number, to: number) =>
    String.fromCharCode(...bytes.slice(from, to));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    return { ok: true, contentType: "image/webp", extension: "webp" };
  }
  return { ok: false, error: "photoType" };
}
