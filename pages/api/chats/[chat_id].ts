import { authOptions } from "@/core/auth";
import { serverPusher } from "@/core/pusher";
import db, { chatsRepository } from "@/core/redis";
import type { PrivateChat, DatabaseChat, Message, User } from "@/core/types";
import { UniqueIdSchema } from "@/core/validations";
import { ChatMemberSchema, PrivateChatSchema } from "@/core/validations/chat";
import { UserSchema } from "@/core/validations/user";
import { withChat } from "@/middlewares/with-chat";
import { withMethods } from "@/middlewares/with-methods";
import { MessageSchema } from "@/validations/message";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import * as z from "zod";
import { fromZodError, ValidationError } from "zod-validation-error";

type Response = {
  messages?: Message[];
  message?: Message;
  chat?: PrivateChat;
};

type Error = ValidationError | string;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | Error>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  const query = UniqueIdSchema.safeParse(req.query.chat_id);
  if (!query.success) {
    const zodErr = fromZodError(query.error);
    return res.status(422).json(zodErr);
  }
  const chat_id = query.data;

  if (req.method === "GET") {
    try {
      // TODO implement pagination
      const messagesJson: string[] = await db.execute([
        "ZRANGE",
        `Chat:Messages:${chat_id}`,
        0,
        100,
      ]);
      const messages: Message[] = messagesJson.map((message) =>
        JSON.parse(message)
      );

      return res.status(200).json({ messages });
    } catch (error) {
      return res.status(500).end();
    }
  }
  if (req.method === "PATCH") {
    try {
      const user = UserSchema.parse(req.body.user);
      const chat = await chatsRepository.fetch(chat_id);
      const lastMessageJson = await db.execute([
        "ZREVRANGE",
        `Chat:Messages:${chat_id}`,
        0,
        0,
      ]);
      if (chat.member_ids.includes(user.id)) {
        return res.status(405).json("Already a member");
      }
      chat.members.push(
        JSON.stringify(
          ChatMemberSchema.parse({
            ...user,
            joined_at: Date.now(),
            role: "member",
          })
        )
      );
      chat.member_ids.push(user.id);

      const newChat = PrivateChatSchema.parse({
        chat_id: chat.entityId,
        name: chat.name,
        private: chat.private,
        member_ids: chat.member_ids,
        chat_image: chat.chat_image,
        created_at: chat.created_at,
        members: chat.members.map((member: string) => JSON.parse(member)),
        last_message: JSON.parse(lastMessageJson),
        chat_owner_id: chat.chat_owner_id,
      });

      await chatsRepository.save(chat);

      const events = [
        {
          channel: `private-user-chats-${user.id}`,
          name: "chat-created",
          data: newChat,
        },
        {
          channel: `private-chat-room-${chat_id}`,
          name: "member-joined",
          data: user,
        },
      ];
      await serverPusher.triggerBatch(events);
      return res.status(200).end();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        return res.status(422).json(zodErr);
      }
      return res.status(422).end();
    }
  }

  if (req.method === "POST") {
    try {
      const message = MessageSchema.parse(req.body.message);
      const created_at = Date.now();
      const newMessage = {
        ...message,
        created_at,
      };

      await db.execute([
        "ZADD",
        `Chat:Messages:${chat_id}`,
        created_at,
        JSON.stringify(newMessage),
      ]);
      await serverPusher.trigger(
        [
          `private-chat-room-${chat_id}`,
          `presence-chat-room-messages-${chat_id}`,
        ],
        "new-message",
        newMessage
      );
      const chat = await chatsRepository.fetch(chat_id);
      chat.last_message = JSON.stringify(newMessage);
      await chatsRepository.save(chat);

      return res.status(200).json({ message: newMessage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        return res.status(422).json(zodErr);
      }
      console.error(error);
      return res.status(422).end();
    }
  }
  if (req.method === "DELETE") {
    try {
      const chat: DatabaseChat = await chatsRepository.fetch(chat_id);
      if (chat.chat_owner_id === session?.user.id) {
        return res.status(403).json("Can't remove own chat.");
      }
      const members: User[] = chat.members
        .map((member: string) => JSON.parse(member))
        .filter((member: User) => member.id !== session?.user.id);

      chat.members = members.map((member) => JSON.stringify(member));
      chat.member_ids = chat.member_ids.filter(
        (id: string) => id !== session?.user.id
      );
      await chatsRepository.save(chat);
      const events = [
        {
          channel: `private-user-chats-${session?.user.id}`,
          name: "chat-removed",
          data: { chat_id },
        },
        {
          channel: `private-chat-room-${chat_id}`,
          name: "member-left",
          data: session.user,
        },
      ];

      await serverPusher.triggerBatch(events);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).end();
    }
  }
}

export default withMethods(
  ["GET", "POST", "PATCH", "DELETE"],
  withChat(handler)
);
