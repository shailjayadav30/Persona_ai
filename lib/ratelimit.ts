import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Automatically loads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the environment
const redis = Redis.fromEnv();

// Create a new rate limiter that allows 10 requests per 10 seconds
export const ratelimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"), // Sliding window algorithm
  analytics: true, // Enables real-time insights in the Upstash console
  prefix: "@upstash/ratelimit", // Optional prefix to avoid key collisions
});
