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
      const exists = await redis.hexists("user:email:" + user.email, "id");
      if (exists) {
        return true;
      }

      // ? Adding custom user and chat id for user

      const user_id = uuid();
      const chat_id = uuid();

      user.id = user_id;
      user.chat_id = chat_id;
      const userJson = JSON.stringify(user);
      await redis.hset(`user:email:${user.email}`, user);

      const created_at = Date.now();

      // ? Initialize chat for a new user
      await redis.hset(`chat:${chat_id}`, {
        id: chat_id,
        created_at,
        private: false,
        last_message: null,
        last_message_time: null,
      });
      await redis.sadd(`chat:members:${chat_id}`, userJson);
      await redis.zadd(`user:chats:${user_id}`, created_at, chat_id);
      // ? Make chat pubic by default
      await redis.sadd("chats:public", chat_id);

      // ? Storing user email substrings in Redis sorted set for email autocomplete

      const sortedSet = [];
      const email = user.email!.toUpperCase();
      for (let i = 1; i < email.length; i++) {
        sortedSet.push(0);
        sortedSet.push(email.substring(0, i));
      }
      sortedSet.push(0);
      sortedSet.push(email + "*" + JSON.stringify(user) + "*");
      await redis.zadd("users:search", ...sortedSet);
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      const dbUser = await redis.hgetall(`user:email:${token.email}`);
      if (!dbUser) {
        token.id = user?.id;
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
        chat_id: dbUser.chat_id,
      };
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.chat_id = token.chat_id as string;
      }
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
