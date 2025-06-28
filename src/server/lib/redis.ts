import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("[Redis] Error", err));

// Conectar al iniciar
await redisClient.connect();

export default redisClient;
