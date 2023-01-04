import { authOptions } from "@/core/auth";
import { chatsRepository } from "@/core/redis";
import { DatabaseChat } from "@/core/types";
import { UniqueIdSchema } from "@/core/validations";
import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import Pusher from "pusher";

export const serverPusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(403).end();
    }
    const user_id = session.user.id;
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      user_id: user_id,
      user_info: { name: session.user.name },
    };
    const authResponse = serverPusher.authorizeChannel(
      socketId,
      channel,
      presenceData
    );

    if (channel.includes("chat-room")) {
      const chat_id = UniqueIdSchema.parse(channel.match(/[^-]+$/)[0]);
      const chat: DatabaseChat = await chatsRepository.fetch(chat_id);

      if (!chat.member_ids.includes(user_id)) {
        await retryAsync(async () => {
          const chat: DatabaseChat = await chatsRepository.fetch(chat_id);
          if (!chat.member_ids.includes(user_id)) {
            throw new Error("Access denied...");
          }
          return res.send(authResponse);
        }, res);
      }
    }

    return res.send(authResponse);
  } catch (error) {
    return res.status(403).end();
  }
}

export default handler;
