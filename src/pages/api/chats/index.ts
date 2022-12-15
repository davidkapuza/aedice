import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import { chatsRepository } from "@/core/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  if (req.method === "GET") {
    try {
      const userChats = await chatsRepository
        .search()
        .where("members_id")
        .contain(session.user.id)
        .return.all();

      const chats = userChats.map((chat: any) => ({
        id: chat.id,
        last_message: chat.last_message,
        last_message_time: chat.last_message_time,
        created_at: chat.created_at,
        private: chat.private,
        members: chat.members.map((member: any) => JSON.parse(member)),
        messages: chat.messages,
        chat_owner: chat.chat_owner,
      }));
      return res.status(200).json({ chats });
    } catch (error) {
      return res.status(500).end();
    }
  }
}

export default withMethods(["GET"], handler);
