import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import { chatsRepository } from "@/core/redis";
import { ChatEntity } from "@/core/types/entities";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  if (req.method === "GET") {
    try {
      console.log("GETTING CHATS...")
      const foundChats = await chatsRepository
        .search()
        .where("members_id")
        .contain(session?.user.id)
        .return.all();

      const chats = foundChats
        .map((chat: ChatEntity) => ({
          chat_id: chat.entityId,
          name: chat.name,
          last_message: chat.last_message,
          last_message_time: chat.last_message_time,
          created_at: chat.created_at,
          private: chat.private,
          members: chat.members.map((member: string) => JSON.parse(member)),
          members_id: chat.members_id,
          messages: chat.messages,
          chat_owner: chat.chat_owner,
        }))
        .sort((a: any, b: any) => a.created_at - b.created_at);

      return res.status(200).json({ chats });
    } catch (error) {
      return res.status(500).end();
    }
  }
}

export default withMethods(["GET"], handler);
