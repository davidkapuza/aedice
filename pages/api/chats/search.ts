// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import { chatsRepository } from "@/core/redis";
import { Chat, DatabaseChat, PublicChat, UniqueId } from "@/core/types";
import { QuerySchema } from "@/core/validations";
import { PublicChatSchema } from "@/core/validations/chat";
import * as z from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { fromZodError, ValidationError } from "zod-validation-error";

type Response = {
  chats: PublicChat[];
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | ValidationError>
) {
  if (req.method === "GET") {
    try {
      const query = QuerySchema.parse(req.query.q);
      const session = await unstable_getServerSession(req, res, authOptions);
      if (!session) {
        return res.status(403).end();
      }
      const foundChats: Array<DatabaseChat & { entityId: UniqueId }> =
        await chatsRepository
          .search()
          .where("chat_owner_id")
          .not.eq(session?.user.id)
          .and("name")
          .matches(query + "*")
          .return.all();

      const chats: PublicChat[] = foundChats.map((chat) =>
        PublicChatSchema.parse({
          chat_id: chat.entityId,
          name: chat.name,
          private: chat.private,
          member_ids: chat.member_ids,
          chat_image: chat.chat_image,
        })
      );

      res.status(200).json({ chats });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        return res.status(422).json(zodErr);
      }
    }
  }
}
export default withMethods(["GET"], handler);
