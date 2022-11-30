import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis } from "@upstash/redis";
import client from "../../../common/lib/redis";
import https from "https";

const redis = Redis.fromEnv({
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
      const email = user.email!.toUpperCase();
      const exists = await client.get("user:email:" + email)
      if (exists) return true

      const emails = [];

      for (let i = 1; i < email.length; i++) {
        emails.push(0);
        emails.push(email.substring(0, i));
      }
      emails.push(0);
      emails.push(email + "*" + JSON.stringify(user) + "*");

      await client.zadd("users", ...emails);

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
