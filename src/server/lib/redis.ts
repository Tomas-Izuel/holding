import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined", { cause: process.env.REDIS_URL });
}

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("[Redis] Error", err));

// Conectar al iniciar
redisClient.connect();

export default redisClient;
