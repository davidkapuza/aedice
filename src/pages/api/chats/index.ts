// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import redis from "@/lib/redis";
import { withMethods } from "@/lib/api-middlewares/with-methods";
import { TypeMessage } from "@/lib/validations/message";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).end();
  }

  const { user } = session;

  if (req.method === "GET") {
    try {
      const userChats = await redis.smembers(`user:chats:${user.uid}`);
      const chats = await Promise.all(
        userChats.map(async (chat_id) => {
          const members = await redis.smembers(`chat:members:${chat_id}`);
          return { chat_id, members };
        })
      );
      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).end();
    }
  }
}

export default withMethods(["GET"], handler);
