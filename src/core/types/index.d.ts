import Client from "redis-om"

declare global {
  var __redisClient: Client
}

export {};