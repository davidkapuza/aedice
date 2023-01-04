import { DatabaseChatSchema } from "@/validations/chat";
import { DatabaseUserSchema, UserSchema } from "@/validations/user";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";
import { chatsRepository, usersRepository } from "./redis";

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
        const exists = await usersRepository
          .search()
          .where("email")
          .eq(user.email!)
          .return.first();
        if (exists) {
          return true;
        }

        // * Create User
        const dbUser = DatabaseUserSchema.parse({
          name: user.name,
          email: user.email,
          image: user.image,
        });
        const userEntity = await usersRepository.createAndSave(dbUser);

        // * Create chat for a new User
        const chatMember = UserSchema.parse({
          id: userEntity.entityId,
          ...dbUser,
        });
        const dbChat = DatabaseChatSchema.parse({
          name: userEntity.name,
          created_at: Date.now(),
          private: false,
          members: [JSON.stringify(chatMember)],
          member_ids: [userEntity.entityId],
          messages: [],
          chat_owner_id: userEntity.entityId,
          chat_image: userEntity.image,
        });
        const chatEntity = chatsRepository.createEntity(dbChat);
        chatEntity.chat_id = chatEntity.entityId;
        await chatsRepository.save(chatEntity);

        // * Augment Session
        user.id = userEntity.entityId;
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.log(fromZodError(error));
          return false;
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
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  pages: {
    // signIn: "/",
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#0000",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  debug: process.env.NODE_ENV === "development",
};
