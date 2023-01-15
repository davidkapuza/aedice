import type { DatabaseChat, RequestWithUser } from "@/core/types";
import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { chatsRepository } from "../redis";
import { UniqueIdSchema } from "../validations";

const checkAccess = createRouter<RequestWithUser, NextApiResponse>();

checkAccess.use(async (req, res, next) => {
  const chat_id = UniqueIdSchema.parse(req.query.chat_id);
  const chat: DatabaseChat = await chatsRepository.fetch(chat_id);

  // TODO implemet private | public chats authorization
  if (req.method === "PATCH") {
    await next();
  }

  if (!chat.member_ids.includes(req.user.id)) {
    await retryAsync(async () => {
      const chat: DatabaseChat = await chatsRepository.fetch(chat_id);
      if (!chat.member_ids.includes(req.user.id!)) {
        throw new Error("Access denied...");
      }
      await next();
    }, res);
  }

  await next();
});

export default checkAccess;
