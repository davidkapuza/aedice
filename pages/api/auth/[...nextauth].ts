import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import client from "../../../common/lib/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ...add more providers here
  ],
  adapter: UpstashRedisAdapter(redis),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      let term = user.email!.toUpperCase();
      let terms = [];
  
      for (let i = 1; i < term.length; i++) {
          terms.push(0);
          terms.push(term.substring(0, i));
      }
      terms.push(0);
      terms.push(term + "*");

          await client.zadd("users", ...terms)

      return true
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
