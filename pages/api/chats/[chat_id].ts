import checkAccess from "@/core/middlewares/checkAccess";
import { serverPusher } from "@/core/pusher";
import db, { chatsRepository } from "@/core/redis";
import type {
  DatabaseChat,
  Message,
  RequestWithUser,
  User,
} from "@/core/types";
import { UniqueIdSchema } from "@/core/validations";
import { ChatMemberSchema, PrivateChatSchema } from "@/core/validations/chat";
import secureHandler from "@/lib/api-handlers/secureHandler";
import { MessageSchema } from "@/validations/message";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";

const router = createRouter<RequestWithUser, NextApiResponse>();

router
  .use(secureHandler)
  .use(checkAccess)
  .get(async (req, res) => {
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
  .post(async (req, res) => {
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
  })
  .patch(async (req, res) => {
    const chat_id = UniqueIdSchema.parse(req.query.chat_id);
    const chat = await chatsRepository.fetch(chat_id);
    if (chat.member_ids.includes(req.user.id)) {
      return res.status(405).json("Already a member");
    }
    chat.members.push(
      JSON.stringify(
        ChatMemberSchema.parse({
          ...req.user,
          joined_at: Date.now(),
          role: "member",
        })
      )
    );
    chat.member_ids.push(req.user.id);
    await chatsRepository.save(chat);

    const newChat = PrivateChatSchema.parse({
      chat_id: chat.entityId,
      name: chat.name,
      access: chat.access,
      member_ids: chat.member_ids,
      chat_image: chat.chat_image,
      created_at: chat.created_at,
      members: chat.members.map((member: string) => JSON.parse(member)),
      last_message: JSON.parse(chat.last_message),
      chat_owner_id: chat.chat_owner_id,
    });

    const events = [
      {
        channel: `private-user-chats-${req.user.id}`,
        name: "chat-created",
        data: newChat,
      },
      {
        channel: `private-chat-room-${chat_id}`,
        name: "member-joined",
        data: req.user,
      },
    ];
    await serverPusher.triggerBatch(events);
    return res.status(200).end();
  })
  .delete(async (req, res) => {
    const chat: DatabaseChat = await chatsRepository.fetch(req.query.chat_id);
    if (chat.chat_owner_id === req.user.id) {
      return res.status(403).json("Can't remove own chat.");
    }
    const members: User[] = chat.members
      .map((member: string) => JSON.parse(member))
      .filter((member: User) => member.id !== req.user.id);

    chat.members = members.map((member) => JSON.stringify(member));
    chat.member_ids = chat.member_ids.filter(
      (id: string) => id !== req.user.id
    );
    await chatsRepository.save(chat);
    const events = [
      {
        channel: `private-user-chats-${req.user.id}`,
        name: "chat-removed",
        data: { chat_id: req.query.chat_id },
      },
      {
        channel: `private-chat-room-${req.query.chat_id}`,
        name: "member-left",
        data: req.user.id,
      },
    ];

    await serverPusher.triggerBatch(events);
    return res.status(204).end();
  });

export default router.handler({
  onError: (err, req, res) => {
    if (err instanceof z.ZodError) {
      const zodErr = fromZodError(err);
      console.error(zodErr);
      return res.status(422).json(zodErr);
    }
    console.error(err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
