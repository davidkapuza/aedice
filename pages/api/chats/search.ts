import { chatsRepository } from "@/core/redis";
import type {
  DatabaseChat,
  PublicChat,
  RequestWithUser,
  UniqueId,
} from "@/core/types";
import { QuerySchema } from "@/core/validations";
import { PublicChatSchema } from "@/core/validations/chat";
import secureHandler from "@/lib/api-handlers/secureHandler";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";

const router = createRouter<RequestWithUser, NextApiResponse>();

router.use(secureHandler).get(async (req, res) => {
  const query = QuerySchema.parse(req.query.q);
  const foundChats: Array<DatabaseChat & { entityId: UniqueId }> =
    await chatsRepository
      .search()
      .where("chat_owner_id")
      .not.eq(req.user.id)
      .and("name")
      .matches(query + "*")
      .return.all();

  const chats: PublicChat[] = foundChats.map((chat) =>
    PublicChatSchema.parse({
      chat_id: chat.entityId,
      name: chat.name,
      access: chat.access,
      member_ids: chat.member_ids,
      chat_image: chat.chat_image,
    })
  );

  return res.status(200).json({ chats });
});

export default router.handler({
  onError: (err, req, res) => {
    if (err instanceof z.ZodError) {
      const zodErr = fromZodError(err);
      console.error(zodErr);
      return res.status(422).json(zodErr);
    }
    console.error(err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
