import { withMethods } from "@/lib/api-middlewares/with-methods";
import { authOptions } from "@/lib/auth";
import redis from "@/lib/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  const { user } = session;
  if (req.method === "GET") {
    try {
      const userChats = await redis.zrevrangebyscore(`user:chats:${user.id}`, "+inf", "-inf");
      const chats = await Promise.all(
        userChats.map(async (chat_id) => {
          const members = await redis.smembers(`chat:members:${chat_id}`);
          const chat = await redis.hgetall(`chat:${chat_id}`)
          return {
            ...chat,
            members: members.map((member) => JSON.parse(member)),
          };
        })
      );
      return res.status(200).json({ chats });
    } catch (error) {
      return res.status(500).end();
    }
  }
}

export default withMethods(["GET"], handler);
