// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authOptions } from "@/core/auth";
import { serverPusher } from "@/core/pusher";
import { chatsRepository } from "@/core/redis";
import { withChat } from "@/middlewares/with-chat";
import { withMethods } from "@/middlewares/with-methods";
import { MessageZodSchema, TypeMessage } from "@/schemas/message";
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
        `cache-chat-update-${chat_id}`,
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

      serverPusher.trigger(`user-chats-${user.id}`, "chat-added", {
        id: chat.id,
        last_message: chat.last_message,
        last_message_time: chat.last_message_time,
        created_at: chat.created_at,
        private: chat.private,
        members: chat.members.map((member: any) => JSON.parse(member)),
        messages: chat.messages,
        chat_owner: chat.chat_owner,
      });
      serverPusher.trigger(
        `cache-chat-update-${chat_id}`,
        "member-joined",
        user
      );

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

      const filteredMembers = chat.members
        .map((member: string) => JSON.parse(member))
        .filter((member: any) => member.id !== session?.user.id);

      serverPusher.trigger(
        `cache-chat-update-${chat_id}`,
        "member-quit",
        filteredMembers
      );
      serverPusher.trigger(
        `user-chats-${session?.user.id}`,
        "chat-removed",
        chat_id
      );

      chat.members = filteredMembers.map((member: any) =>
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
