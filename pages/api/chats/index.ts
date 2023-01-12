import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import { chatsRepository } from "@/core/redis";
import { DatabaseChat, PrivateChat, UniqueId } from "@/core/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import * as z from "zod";
import { fromZodError, ValidationError } from "zod-validation-error";

type Response = {
  chats: PrivateChat[];
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response | ValidationError>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  if (req.method === "GET") {
    try {
      const foundChats: Array<DatabaseChat & { entityId: UniqueId }> =
        await chatsRepository
          .search()
          .where("member_ids")
          .contain(session?.user.id)
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
            a.members.find((member) => member.id === session.user.id)
              ?.joined_at -
            b.members.find((member) => member.id === session.user.id)?.joined_at
        );

      return res.status(200).json({ chats });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        console.log(zodErr);
        return res.status(422).json(zodErr);
      }
      return res.status(500).end();
    }
  }
}

export default withMethods(["GET"], handler);
