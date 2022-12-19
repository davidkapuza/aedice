// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import { chatsRepository } from "@/core/redis";
import { ChatEntity } from "@/core/types/entities";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

type Data = {
  chats: ChatEntity[];
};
type Error = {
  error: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method === "GET") {
    const query = req.query.q;
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!query) {
      res.status(400).json({
        error: "Search can not be empty...",
      });
    } else if (query.length < 50) {
      const foundChats = await chatsRepository
        .search()
        .where("chat_owner")
        .not.eq(session?.user.id)
        .and("name")
        .matches(query + "*")
        .return.all();

      const chats = foundChats.map((chat: ChatEntity) => ({
        chat_id: chat.entityId,
        name: chat.name,
        private: chat.private,
        members: chat.members.map((member: string) => JSON.parse(member)),
        members_id: chat.members_id,
        chat_owner: chat.chat_owner,
      }));

      res.status(200).json({ chats });
    } else {
      res.status(400).json({
        error: "Max 50 characters please.",
      });
    }
  }
}
export default withMethods(["GET"], handler);
