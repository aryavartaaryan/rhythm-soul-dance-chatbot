// lib/rateLimit.ts
// In-memory rate limiter: max N requests per window per IP.
// Resets server-side on cold starts (acceptable for Vercel serverless).

interface BucketEntry {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, BucketEntry>();

const MAX_REQUESTS = 20;      // requests per window
const WINDOW_MS = 60_000;     // 1 minute window

/** Returns true if the IP is allowed, false if rate-limited. */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = buckets.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}
