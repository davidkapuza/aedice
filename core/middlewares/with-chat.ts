import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";
import { authOptions } from "../auth";
import { chatsRepository } from "../redis";
import type { DatabaseChat } from "../types";
import { UniqueIdSchema } from "../validations";

export function withChat(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      const chat_id = UniqueIdSchema.parse(req.query.chat_id);
      const session = await unstable_getServerSession(req, res, authOptions);
      const chat: DatabaseChat = await chatsRepository.fetch(chat_id);

      // TODO implemet private | public chats authorization
      if (req.method === "PATCH" && !chat.private) {
        return handler(req, res);
      }

      if (!chat.member_ids.includes(session?.user.id)) {
        await retryAsync(async () => {
          const chat: DatabaseChat = await chatsRepository.fetch(chat_id);
          if (!chat.member_ids.includes(session?.user.id)) {
            throw new Error("Access denied...");
          }
          return handler(req, res);
        }, res);
      }

      return handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        return res.status(422).json(zodErr);
      }
      return res.status(403).end();
    }
  };
}
