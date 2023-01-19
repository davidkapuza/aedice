import type { Message, RequestWithUser } from "@/core/types";
import type { NextApiResponse } from "next";
import { UniqueIdSchema } from "@/core/validations";
import { checkAccess } from "@/middlewares/checkAccess";
import { MessageSchema } from "@/validations/message";
import { createRouter } from "next-connect";
import secureHandler from "server/api-handlers/secureHandler";
import { serverPusher } from "server/services/pusher";
import db, { chatsRepository } from "../../../server/services/redis";
import { fromZodError } from "zod-validation-error";
import * as z from "zod"

const router = createRouter<RequestWithUser, NextApiResponse>();

router
  .use(secureHandler)
  .get(checkAccess("messages", "read:own"), async (req, res) => {
    const chat_id = UniqueIdSchema.parse(req.query.chat_id);
    // TODO implement pagination
    const messagesJson: string[] = await db.execute([
      "ZRANGE",
      `Chat:Messages:${chat_id}`,
      0,
      100,
    ]);
    const messages: Message[] = messagesJson.map((message) =>
      JSON.parse(message)
    );

    return res.status(200).json({ messages });
  })
  .post(checkAccess("messages", "create:own"), async (req, res) => {
    const message = MessageSchema.parse(req.body.message);
    const created_at = Date.now();
    const newMessage = {
      ...message,
      created_at,
    };

    await db.execute([
      "ZADD",
      `Chat:Messages:${req.query.chat_id}`,
      created_at,
      JSON.stringify(newMessage),
    ]);
    await serverPusher.trigger(
      [
        `private-chat-room-${req.query.chat_id}`,
        `presence-chat-room-messages-${req.query.chat_id}`,
      ],
      "new-message",
      newMessage
    );
    const chat = await chatsRepository.fetch(req.query.chat_id);
    chat.last_message = JSON.stringify(newMessage);
    await chatsRepository.save(chat);
    return res.status(200).json({ message: newMessage });
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
