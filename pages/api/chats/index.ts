import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import { chatsRepository } from "@/core/redis";
import { Chat, DatabaseChat, UniqueId } from "@/core/types";
import { ChatSchema } from "@/core/validations/chat";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import * as z from "zod";
import { fromZodError, ValidationError } from "zod-validation-error";

type Response = {
  chats: Chat[];
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

      const chats: Chat[] = foundChats
        .map((chat) =>
          ChatSchema.parse({
            chat_id: chat.entityId,
            name: chat.name,
            last_message: chat.last_message,
            last_message_time: Number(chat?.last_message_time),
            created_at: chat.created_at,
            private: chat.private,
            members: chat.members.map((member: string) => JSON.parse(member)),
            member_ids: chat.member_ids,
            chat_owner_id: chat.chat_owner_id,
            chat_image: chat.chat_image,
          })
        )
        .sort((a: any, b: any) => a.created_at - b.created_at);

      return res.status(200).json({ chats });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErr = fromZodError(error);
        console.log(zodErr)
        return res.status(422).json(zodErr);
      }
      return res.status(500).end();
    }
  }
}

export default withMethods(["GET"], handler);
