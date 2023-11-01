import { Redis } from "ioredis";
import { Prisma } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

export const redis: Prisma.Middleware = createPrismaRedisCache({
    models: [
        { model: "Author" },
        { model: "BookPremium" }
    ],
    storage: { type: "redis", options: { client: redisClient, invalidation: { referencesTTL: 300 }, log: console } },
    cacheTime: 300,
    onHit: (key) => {
        console.log("redis hit");
      },
      onMiss: (key) => {
        console.log("redis miss");
      },
      onError: (key) => {
        console.log("redis error");
      },
})