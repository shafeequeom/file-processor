// lib/rateLimiter.ts
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisConnection } from "@/lib/redis";

export const rateLimiter = new RateLimiterRedis({
    storeClient: redisConnection,
    keyPrefix: "middleware",
    points: 10, // max requests
    duration: 10, // per 10 seconds
});