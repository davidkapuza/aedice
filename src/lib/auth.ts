import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuid } from "uuid";
import redis from "./redis";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      // ? Checking if user already exists
      const exists = await redis.hexists("user:email:" + user.email, "uid");
      if (exists) {
        return true;
      }

      // ? Adding custom uid and chat id for user

      const uid = uuid();
      const chat_id = uuid();

      user.uid = uid;
      user.chat_id = chat_id;

      const userJson = JSON.stringify({ uid, chat_id, ...user });

      await redis.hset("user:email:" + user.email, user);

      // ? Initialize chat for a new user
      await redis.sadd("chat:members:" + chat_id, userJson);

      // ? Storing user email substrings in Redis sorted set for email autocomplete

      const sortedSet = [];
      const email = user.email!.toUpperCase();
      for (let i = 1; i < email.length; i++) {
        sortedSet.push(0);
        sortedSet.push(email.substring(0, i));
      }
      sortedSet.push(0);
      sortedSet.push(email + "*" + userJson + "*");
      await redis.zadd("users:search", ...sortedSet);
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token;
        token.uid = user?.uid;
        token.chat_id = user?.chat_id;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.uid = token.uid as string;
      session.user.chat_id = token.chat_id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#0000",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  debug: true,
};
