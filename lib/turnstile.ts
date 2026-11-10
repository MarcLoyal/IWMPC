const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Checks a Cloudflare Turnstile token with Cloudflare. Returns false for a
 * missing or rejected token and when Cloudflare cannot be reached.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  options: { secret: string; ip?: string; fetch?: typeof fetch },
): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret: options.secret, response: token });
  if (options.ip) body.set("remoteip", options.ip);
  try {
    const res = await (options.fetch ?? fetch)(VERIFY_URL, {
      method: "POST",
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
