import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis as UpstashRedis } from "@upstash/redis";
import https from "https";
import Redis from "ioredis";

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
      const exists = await client.get("user:email:" + email);
      if (exists) {
        await client.quit();
        return true;
      }

      // * Storing user email substrings in Redis sorted set for
      // * search by email autocomplete
      const emails = [];

      for (let i = 1; i < email.length; i++) {
        emails.push(0);
        emails.push(email.substring(0, i));
      }
      emails.push(0);

      // * Stored in format:
      /*
      * "KAPUZADAVID@GMAIL.COM*
      * {\"name\":\"David Kapuza\",
      * \"email\":\"kapuzadavid@gmail.com\",
      * \"image\":\"https://lh3.googleusercontent.com/a/ALm5wu0rhyTEoyk_EGFliI0638hehkG-6vC0usHQLiBS=s96-c\",
      * \"emailVerified\":null,
      * \"id\":\"4dfacb8d-c352-4ba9-ade9-f434eb087b3d\"}*"
      * */

      emails.push(email + "*" + JSON.stringify(user) + "*");

      await client.zadd("users", ...emails);

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
