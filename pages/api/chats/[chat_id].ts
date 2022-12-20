// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authOptions } from "@/core/auth";
import { serverPusher } from "@/core/pusher";
import { chatsRepository } from "@/core/redis";
import { TypeMessage } from "@/core/types/entities";
import { withChat } from "@/middlewares/with-chat";
import { withMethods } from "@/middlewares/with-methods";
import { MessageZodSchema } from "@/schemas/message";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import * as z from "zod";
import { ZodIssue } from "zod";

type Messages = {
  messages: TypeMessage[];
};
type Message = {
  message: TypeMessage;
};
type Error = ZodIssue[] | string;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Messages | Message | Error>
) {
  const chat_id = req.query.chat_id as string;

  if (req.method === "GET") {
    try {
      const { messages: messagesJson } = await chatsRepository.fetch(chat_id);
      const messages: TypeMessage[] = messagesJson
        .map((message: any) => JSON.parse(message))
        .sort((a: any, b: any) => a.created_at - b.created_at);

      return res.status(200).json({ messages });
    } catch (error) {
      return res.status(500).end();
    }
  }

  if (req.method === "POST") {
    try {
      const message = MessageZodSchema.parse(req.body.message);

      // * Update to server timestamp
      const created_at = Date.now();
      const newMessage = {
        ...message,
        created_at,
      };

      serverPusher.trigger(
        [`chat-room-${chat_id}`, `chat-room-messages-${chat_id}`],
        "new-message",
        newMessage
      );

      const chat = await chatsRepository.fetch(chat_id);
      chat.messages.push(JSON.stringify(newMessage));
      chat.last_message_time = created_at;
      chat.last_message = message.text;
      await chatsRepository.save(chat);

      res.status(200).json({ message: newMessage });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues);
      }

      return res.status(422).end();
    }
  }
  if (req.method === "PATCH") {
    try {
      const user = req.body.user;
      const chat = await chatsRepository.fetch(chat_id);

      if (chat.members_id.includes(user.id)) {
        return res.status(405).json("Not Allowed");
      }
      chat.members.push(JSON.stringify(user));
      chat.members_id.push(user.id);

      const events = [
        {
          channel: `user-chats-${user.id}`,
          name: "chat-created",
          data: chat_id,
        },
        {
          channel: `chat-room-${chat_id}`,
          name: "member-joined",
          data: user,
        },
      ];

      serverPusher.triggerBatch(events);

      await chatsRepository.save(chat);
      return res.end();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues);
      }
      return res.status(422).end();
    }
  }
  if (req.method === "DELETE") {
    try {
      const session = await unstable_getServerSession(req, res, authOptions);
      const chat = await chatsRepository.fetch(chat_id);
      if (chat.chat_owner === session?.user.id) {
        return res.status(403);
      }

      const members = chat.members
        .map((member: string) => JSON.parse(member))
        .filter((member: any) => member.id !== session?.user.id);

      const events = [
        {
          channel: `chat-room-${chat_id}`,
          name: "member-left",
          data: members,
        },
        {
          channel: `user-chats-${session?.user.id}`,
          name: "chat-removed",
          data: chat_id,
        },
      ];

      serverPusher.triggerBatch(events);

      chat.members = members.map((member: any) =>
        JSON.stringify(member)
      );
      chat.members_id = chat.members_id.filter(
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
