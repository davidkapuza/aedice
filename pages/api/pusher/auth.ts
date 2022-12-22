import { authOptions } from "@/core/auth";
import { serverPusher } from "@/core/pusher";
import { chatsRepository } from "@/core/redis";
import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(403).end();
    }
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      user_id: session.user.id,
      user_info: { name: session.user.name },
    };
    const authResponse = serverPusher.authorizeChannel(
      socketId,
      channel,
      presenceData
    );

    if (channel.includes("chat-room")) {
      const chat_id = channel.match(/[^-]+$/)[0];
      const chat = await chatsRepository.fetch(chat_id);

      if (!chat.members_id.includes(session?.user.id)) {
        await retryAsync(async () => {
          const chat = await chatsRepository.fetch(chat_id);
          if (!chat.members_id.includes(session?.user.id)) {
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
