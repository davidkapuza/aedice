import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis as UpstashRedis } from "@upstash/redis";
import https from "https";
import Redis from "ioredis";
import { v4 as uuid } from "uuid";

const redis = UpstashRedis.fromEnv({
  agent: new https.Agent({ keepAlive: true }),
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: UpstashRedisAdapter(redis),
  callbacks: {
    async signIn({ user }) {
      const client = new Redis(process.env.REDIS_URL!);

      const email = user.email!.toUpperCase();
      // * Checking if user already exists
      const exists = await client.get("user:email:" + user.email);
      if (exists) {
        await client.quit();
        return true;
      }

      // * Storing user email substrings in Redis sorted set for
      // * search by email autocomplete
      const results = [];

      for (let i = 1; i < email.length; i++) {
        results.push(0);
        results.push(email.substring(0, i));
      }
      results.push(0);

      // * Stored in format:
      /*
      * "EMAIL@DOMAIN.COM*
      * {\"name\":\"Jhon Doe\",
      * \"email\":\"jhondoe@domain.com\",
      * \"image\":\"https://example.com\",
      * \"emailVerified\":null,
      * \"id\":\"id\"}"
      * \"chatId\":\"chatId\"}*"
      * */
      
      const chatId = uuid()
      const userJson = JSON.stringify({chatId, ...user})

      results.push(email + "*" + userJson + "*");

      await client.zadd("users", ...results);

      // * Initialize chat for a new user

      await client.zadd("chat:members:" + chatId, 0, userJson);


      await client.quit();
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "database",
  },
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "#0000", // Hex color code
    logo: "https://next-auth.js.org/img/logo/logo-sm.png", // Absolute URL to image
  },
  debug: true,
};
export default NextAuth(authOptions);
