import type { DatabaseChat, RequestWithUser, User } from "@/core/types";
import type { NextApiResponse } from "next";
import { UniqueIdSchema } from "@/core/validations";
import { ChatMemberSchema, PrivateChatSchema } from "@/core/validations/chat";
import { checkAccess } from "@/middlewares/checkAccess";
import { createRouter } from "next-connect";
import secureHandler from "server/api-handlers/secureHandler";
import { serverPusher } from "server/services/pusher";
import { chatsRepository } from "../../../server/services/redis";
import { fromZodError } from "zod-validation-error";
import * as z from "zod";

const router = createRouter<RequestWithUser, NextApiResponse>();

router
  .use(secureHandler)
  .patch(checkAccess("chats", "update:any"), async (req, res) => {
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
          chat_role: "member",
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
  .delete(checkAccess("chats", "delete:own"), async (req, res) => {
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
