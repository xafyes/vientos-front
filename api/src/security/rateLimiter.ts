/**
 * Best-effort in-memory sliding-window limiter, keyed by client IP.
 *
 * This resets on every cold start and is not shared across scaled-out
 * instances, so it is NOT a substitute for a real rate-limiting layer under
 * sustained abuse — it is a cheap first line of defense against a casual
 * script hammering the booking endpoint, layered on top of the honeypot
 * field and input validation.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Bound memory: an unbounded map under IP-spraying abuse would itself be a
  // resource-exhaustion vector, so old keys are swept out periodically.
  if (hits.size > 5000) {
    for (const [k, timestamps] of hits) {
      if (timestamps.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-azure-clientip') ?? 'unknown';
}
