import redis from "redis"

import dotenv from "dotenv"

dotenv.config()

export const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS
});