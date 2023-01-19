import type { DatabaseChat, RequestWithUser } from "@/core/types";
import { getIdFromString } from "@/lib/utils/getIdFromString";
import retryAsync from "@/lib/utils/retryAsync";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import secureHandler from "server/api-handlers/secureHandler";
import { serverPusher } from "server/services/pusher";
import { chatsRepository } from "server/services/redis";
import { fromZodError } from "zod-validation-error";
import * as z from "zod"

const router = createRouter<RequestWithUser, NextApiResponse>();

router.use(secureHandler).post(async (req, res) => {
  const user_id = req.user.id;
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: user_id,
    user_info: req.user,
  };
  const authResponse = serverPusher.authorizeChannel(
    socketId,
    channel,
    presenceData
  );

  if (channel.includes("chat-room")) {
    const chat_id = getIdFromString(channel);
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
  onNoMatch: (req, res) =>
    res.status(404).send({
      message: `API route not found: ${req.url}`,
    }),

  onError: (err, req, res) => {
    if (err instanceof z.ZodError) {
      const zodErr = fromZodError(err);
      console.error(zodErr);
      return res.status(422).json(zodErr);
    }
    console.error(err);
    res.status(500).send({
      message: `Unexpected error.`,
      error: err,
    });
  },
});
