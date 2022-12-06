import { initializeUserInDb } from "@lib/services/server/initializeUserInDb";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { Redis as UpstashRedis } from "@upstash/redis";
import https from "https";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      return await initializeUserInDb(user);
    },
    async session({ session, user }) {
      session.user.uid = user.uid;
      return session;
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
