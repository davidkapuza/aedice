import type {
  DatabaseChat,
  PublicChat,
  RequestWithUser,
  UniqueId,
} from "@/core/types";
import type { NextApiResponse } from "next";
import { QuerySchema } from "@/core/validations";
import { PublicChatSchema } from "@/core/validations/chat";
import { checkAccess } from "@/middlewares/checkAccess";
import { createRouter } from "next-connect";
import secureHandler from "server/api-handlers/secureHandler";
import { chatsRepository } from "server/services/redis";
import { fromZodError } from "zod-validation-error";
import * as z from "zod";

const router = createRouter<RequestWithUser, NextApiResponse>();

router
  .use(secureHandler)
  .get(checkAccess("chats", "read:any"), async (req, res) => {
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
  onNoMatch: (req, res) =>
    res.status(404).send({
      message: `API route not found: ${req.url}`,
    }),

  onError: (err, req, res) => {
    if (err instanceof z.ZodError) {
      const zodErr = fromZodError(err);
      console.error(zodErr);
      return res.status(422).json(zodErr);
    }
    console.error(err);
    res.status(500).send({
      message: `Unexpected error.`,
      error: err,
    });
  },
});
