import { authOptions } from "@/core/auth";
import { serverPusher } from "@/core/pusher";
import { chatsRepository } from "@/core/redis";
import { UniqueIdSchema } from "@/core/validations";
import { withChat } from "@/middlewares/with-chat";
import { withMethods } from "@/middlewares/with-methods";
import { MessageSchema } from "@/validations/message";
import type { Chat, DatabaseChat, Message, User } from "@/core/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import * as z from "zod";
import { UserSchema } from "@/core/validations/user";
import { fromZodError, ValidationError } from "zod-validation-error";

type Response = {
  messages?: Message[];
  message?: Message;
  chat?: Chat;
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
      const { messages: messagesJson } = await chatsRepository.fetch(chat_id);
      const messages: Message[] = messagesJson
        .map((message: any) => JSON.parse(message))
        .sort((a: any, b: any) => a.created_at - b.created_at);

      return res.status(200).json({ messages });
    } catch (error) {
      return res.status(500).end();
    }
  }
  if (req.method === "PATCH") {
    try {
      const user = UserSchema.parse(req.body.user);
      const chat: DatabaseChat = await chatsRepository.fetch(chat_id);

      if (chat.member_ids.includes(user.id)) {
        return res.status(405).json("Not Allowed");
      }
      chat.members.push(JSON.stringify(user));
      chat.member_ids.push(user.id);

      const newChat: Chat = {
        chat_id: chat_id,
        last_message_time: chat.last_message_time,
        created_at: chat.created_at,
        name: chat.name,
        private: chat.private,
        member_ids: chat.member_ids,
        chat_image: chat.chat_image,
        members: chat.members.map((memmber) => JSON.parse(memmber)),
        chat_owner_id: chat.chat_owner_id,
        last_message: chat.last_message,
      }

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
      serverPusher.triggerBatch(events);

      await chatsRepository.save(chat);
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
      serverPusher.trigger(
        [`private-chat-room-${chat_id}`, `presence-chat-messages-${chat_id}`],
        "new-message",
        newMessage
      );

      const chat: DatabaseChat = await chatsRepository.fetch(chat_id);
      chat.messages.push(JSON.stringify(newMessage));
      chat.last_message_time = created_at;
      chat.last_message = message.text;
      await chatsRepository.save(chat);

      return res.status(200).json({ message: newMessage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        return res.status(422).json(zodErr);
      }
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
      
      const events = [
        {
          channel: `private-user-chats-${session?.user.id}`,
          name: "chat-removed",
          data: { chat_id },
        },
        {
          channel: `private-chat-room-${chat_id}`,
          name: "member-left",
          data: session?.user,
        },
      ];

      serverPusher.triggerBatch(events);

      chat.members = members.map((member) => JSON.stringify(member));
      chat.member_ids = chat.member_ids.filter(
        (id: string) => id !== session?.user.id
      );
      await chatsRepository.save(chat);
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
