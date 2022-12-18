import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import * as z from "zod";
import { chatsRepository, usersRepository } from "./redis";

import { ChatZodSchema } from "./schemas/chat";
import { UserZodSchema } from "./schemas/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      try {
        const created_at = Date.now();

        // * Checking if user already exists
        const exists = await usersRepository
          .search()
          .where("email")
          .eq(user.email!)
          .return.first();
        if (exists) {
          return true;
        }

        // * Create User
        const newUser = UserZodSchema.parse(user);
        const userEntity = await usersRepository.createAndSave(newUser);

        // * Create chat for a new User
        const newChat = ChatZodSchema.parse({
          name: userEntity.name,
          created_at,
          private: false,
          last_message: null,
          last_message_time: null,
          members: [JSON.stringify({ id: userEntity.entityId, ...newUser })],
          members_id: [userEntity.entityId],
          messages: [],
          chat_owner: userEntity.entityId,
        });

        await chatsRepository.createAndSave(newChat);

        // * Augument User
        user.id = userEntity.entityId;

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log(error.issues);
        }
        console.log(error);
        return false;
      }
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      const dbUser =
        token?.email &&
        (await usersRepository
          .search()
          .where("email")
          .eq(token.email)
          .return.first());

      if (!dbUser) {
        token.id = user?.id;
        return token;
      }

      return {
        id: dbUser?.entityId,
        name: dbUser?.name,
        email: dbUser?.email,
        image: dbUser?.image,
      };
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
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
