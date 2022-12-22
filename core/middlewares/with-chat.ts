import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "../auth";
import { chatsRepository } from "../redis";

export const schema = z.object({
  chat_id: z.string(),
});

export function withChat(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const query = schema.parse(req.query);
      const session = await unstable_getServerSession(req, res, authOptions);
      const chat = await chatsRepository.fetch(query.chat_id);
      
      // TODO implemet private | public chats authorization
      if (req.method === "PATCH" && !chat.private) {
        return handler(req, res);
      }

      if (!chat.members_id.includes(session?.user.id)) {
        await retryAsync(async () => {
          const chat = await chatsRepository.fetch(query.chat_id);
          if (!chat.members_id.includes(session?.user.id)) {
            throw new Error("Access denied...")
          }
          return handler(req, res);
        }, res)
      }
      
      return handler(req, res);
    } catch (error) {
      return res.status(403).end();
    }
  };
}
