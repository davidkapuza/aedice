import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "../auth";
import redis from "../redis";

export const schema = z.object({
  chat_id: z.string(),
});

export function withChat(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const query = schema.parse(req.query);

      // ? Check if chat is public or private
      const isPublic = await redis.sismember("chats:public", query.chat_id);
      if (isPublic) return handler(req, res);
      // TODO add support for private chats
      // ? Check if user has access to this chat.
      const session = await unstable_getServerSession(req, res, authOptions);
      const exists = await redis.hexists(
        `user:chats:${session?.user.id}`,
        query.chat_id
      );

      if (!exists) {
        return res.status(403).end();
      }
      return handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };
}
