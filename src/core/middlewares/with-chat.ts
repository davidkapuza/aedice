import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "../auth";
import db, { chatsRepository } from "../redis";
import { chatSchema } from "../schemas/chat";

export const schema = z.object({
  chat_id: z.string(),
});

export function withChat(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const query = schema.parse(req.query);
      const session = await unstable_getServerSession(req, res, authOptions);
      const chat = await chatsRepository.fetch(query.chat_id);

      if (!chat.members_id.includes(session?.user.id) && chat.private) {
        return res.status(403).end();
      }

      return handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };
}
