import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, "1 m"), // 50 reqs / minute per IP
      analytics: true,
    })
  : null;

export async function ensureRateLimit(req, keyOverride) {
  if (!limiter) return null; // no-op if not configured
  const ip =
    keyOverride ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "anonymous";

  const { success, reset } = await limiter.limit(ip);
  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(reset) },
    });
  }
  return null;
}