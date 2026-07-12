import { createClient, type RedisClientType } from "redis";
import { env } from "./env.js";

let redis: RedisClientType;

const createRedisClient = (): RedisClientType => {
  const client: RedisClientType = createClient({
    url: env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.error("Redis error:", err.message);
  });

  client.on("connect", () => {
    console.log("Redis connected");
  });

  return client;
};

const connectRedis = async (): Promise<void> => {
  try {
    redis = createRedisClient();
    await redis.connect();
  } catch (err) {
    console.warn("Redis connection failed, continuing without cache:", (err as Error).message);
  }
};

const disconnectRedis = async (): Promise<void> => {
  if (redis?.isOpen) {
    await redis.quit();
  }
};

export { redis, connectRedis, disconnectRedis };
