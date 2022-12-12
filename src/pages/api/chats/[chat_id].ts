// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";
import * as z from "zod";
import { serverPusher } from "@/core/pusher";
import { MessageSchema, TypeMessage } from "@/lib/validations/message";
import { withMethods } from "@/lib/api-middlewares/with-methods";
import { withChat } from "@/lib/api-middlewares/with-chat";
import { UserSchema } from "@/lib/validations/user";
import { ZodIssue } from "zod";

type Messages = {
  messages: TypeMessage[];
};
type Message = {
  message: TypeMessage;
};
type Error = ZodIssue[];

async function handler(req: NextApiRequest, res: NextApiResponse<Messages | Message | Error>) {
  const chat_id = req.query.chat_id as string;

  if (req.method === "GET") {
    try {
      const chat: string[] = await redis.hvals(`chat:messages:${chat_id}`);
      const messages: TypeMessage[] = chat
        .map((message) => JSON.parse(message))
        .sort((a, b) => a.created_at - b.created_at);

      return res.status(200).json({ messages });
    } catch (error) {
      return res.status(500).end();
    }
  }

  if (req.method === "POST") {
    try {
      const message = MessageSchema.parse(req.body.message);

      // * Update to server timestamp
      const newMessage = {
        ...message,
        created_at: Date.now(),
      };

      await redis.hset(
        `chat:messages:${chat_id}`,
        message.id,
        JSON.stringify(newMessage)
      );
      serverPusher.trigger(
        `chat-messages-${chat_id}`,
        "new-message",
        newMessage
      );

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

      const user = UserSchema.parse(req.body.user);
      const members = await redis.smembers(`chat:members:${chat_id}`)

      serverPusher.trigger(
        `user-chats-${user.id}`,
        "new-chat",
        { chat_id, members: [user, ...members.map(member => JSON.parse(member))] }
      );
      serverPusher.trigger(
        `chat-members-${chat_id}`,
        "new-member",
        user
      )


      await redis.sadd(`chat:members:${chat_id}`, JSON.stringify(user));
      await redis.zadd(`user:chats:${user.id}`, Date.now(), chat_id)
      

      return res.end();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(422).json(error.issues);
      }
      return res.status(422).end();
    }
  }
}

export default withMethods(["GET", "POST", "PATCH"], withChat(handler));
