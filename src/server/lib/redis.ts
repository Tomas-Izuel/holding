import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export function getRedisClient() {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is not defined");
    }
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.on("error", (err) => console.error("[Redis] Error", err));
    redisClient.connect();
  }
  return redisClient;
}
