/**
 * Fixed-window rate limiter, kept in memory.
 *
 * TODO(launch): on Vercel each serverless instance has its own memory, so this
 * only slows down a burst that lands on the same instance. Swap in Upstash /
 * Vercel KV for a shared counter if spam becomes a problem. Turnstile and the
 * honeypot are the main defences.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    /** Records one attempt; returns false when `key` is over the limit. */
    check(key: string, now: number = Date.now()): boolean {
      // Drop expired entries so the map cannot grow without bound.
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
      }
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      entry.count += 1;
      return entry.count <= limit;
    },
  };
}

/** 5 submissions per 10 minutes per IP address. */
export const formRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});
