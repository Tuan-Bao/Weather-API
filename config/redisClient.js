import { configDotenv } from "dotenv";
import redis from "redis";
configDotenv();

// Kết nối Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Xử lí lỗi Redis Client
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redisClient;
