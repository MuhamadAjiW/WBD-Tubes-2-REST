import { Prisma } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import { redisClient } from "../config/redis-config";

export const redisMiddleware: Prisma.Middleware = createPrismaRedisCache({
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