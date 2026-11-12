/**
 * Sliding-window rate limiter kept in memory.
 *
 * Limitation (documented on purpose): on Lambda each warm instance has its own memory, so
 * the effective limit is per instance, and it resets on cold start. It stops casual floods of
 * a public form; a shared store (Redis/DynamoDB) is the upgrade if abuse becomes real.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  function prune(now: number) {
    if (hits.size < 5_000) return;
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(key);
    }
  }

  return {
    /** Records a hit for `key` and returns false when it is over the limit. Blocked hits aren't recorded. */
    check(key: string, now: number = Date.now()): boolean {
      prune(now);
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      return true;
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
