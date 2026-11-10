// No 0/O, 1/I/L: a member may read this number out over the phone.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** `RPT-20261110-K7QD` — prefix, date in Manila, four random characters. */
export function makeReference(
  prefix: string,
  now: Date = new Date(),
  random: () => number = Math.random,
): string {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .replace(/-/g, "");
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += ALPHABET[Math.floor(random() * ALPHABET.length)];
  }
  return `${prefix}-${date}-${code}`;
}
