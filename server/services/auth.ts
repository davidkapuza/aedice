import { v4 as uuid } from "uuid";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";
import { ChatMemberSchema, DatabaseChatSchema } from "@/validations/chat";
import { DatabaseUserSchema } from "@/validations/user";
import { MessageSchema } from "@/validations/message";
import { chatsRepository, usersRepository } from "./redis";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { Roles } from "@/core/types";

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

        const created_at = Date.now();
        const dbUser = DatabaseUserSchema.parse({
          name: user.name,
          email: user.email,
          image: user.image,
          role: "user",
        });
        const userEntity = await usersRepository.createAndSave(dbUser);

        const chatMember = ChatMemberSchema.parse({
          id: userEntity.entityId,
          name: userEntity.name,
          email: userEntity.email,
          image: userEntity.image,
          role: "user",
          joined_at: Date.now(),
          chat_role: "owner",
        });
        const lastMessage = MessageSchema.parse({
          id: uuid(),
          text: "No messages yet...",
          created_at,
          username: userEntity.name,
          image: userEntity.image,
          sender_id: userEntity.entityId,
        });
        // TODO send first last_message from aedice account not user itself
        const dbChat = DatabaseChatSchema.parse({
          name: userEntity.name,
          created_at,
          last_message: JSON.stringify(lastMessage),
          members: [JSON.stringify(chatMember)],
          member_ids: [userEntity.entityId],
          chat_image: userEntity.image,
          chat_owner_id: userEntity.entityId,
        });

        const chatEntity = chatsRepository.createEntity(dbChat);
        await chatsRepository.save(chatEntity);

        user.id = userEntity.entityId;
        user.role = userEntity.role;
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(fromZodError(error));
          return false;
        }
        console.error(error);
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
        token.role = user?.role;
        return token;
      }

      return {
        id: dbUser?.entityId,
        name: dbUser?.name,
        email: dbUser?.email,
        image: dbUser?.image,
        role: dbUser?.role,
      };
    },
    async session({ session, token, user }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as Roles;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#0000",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  debug: process.env.NODE_ENV === "development",
};
