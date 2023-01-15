import { chatsRepository } from "@/core/redis";
import type {
  DatabaseChat,
  PrivateChat,
  RequestWithUser,
  UniqueId,
} from "@/core/types";
import type { NextApiResponse } from "next";
import secureHandler from "@/lib/api-handlers/secureHandler";
import { createRouter } from "next-connect";
import { fromZodError } from "zod-validation-error";
import * as z from "zod";

const router = createRouter<RequestWithUser, NextApiResponse>();

router.use(secureHandler).get(async (req, res) => {
  const foundChats: Array<DatabaseChat & { entityId: UniqueId }> =
    await chatsRepository
      .search()
      .where("member_ids")
      .contain(req.user.id)
      .return.all();

  const chats: PrivateChat[] = foundChats
    .map((chat) => ({
      chat_id: chat.entityId,
      name: chat.name,
      last_message: JSON.parse(chat.last_message),
      created_at: chat.created_at,
      access: chat.access as "public" | "private",
      members: chat.members.map((member: string) => JSON.parse(member)),
      member_ids: chat.member_ids,
      chat_image: chat.chat_image,
      chat_owner_id: chat.chat_owner_id,
    }))
    .sort(
      (a, b) =>
        a.members.find((member) => member.id === req.user.id)?.joined_at -
        b.members.find((member) => member.id === req.user.id)?.joined_at
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
