import { serverPusher } from "@/core/pusher";
import { chatsRepository } from "@/core/redis";
import type { DatabaseChat, RequestWithUser } from "@/core/types";
import { UniqueIdSchema } from "@/core/validations";
import secureHandler from "@/lib/api-handlers/secureHandler";
import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<RequestWithUser, NextApiResponse>();

router.use(secureHandler).all(async (req, res) => {
  const user_id = req.user.id;
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: user_id,
    user_info: { name: req.user.name },
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
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).end("Access denied");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
