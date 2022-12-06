// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import client from "@core/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { serverPusher } from "@core/pusher";
import { TMessage } from "@core/types/entities";

type Data = {
  message: TMessage;
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method !== "POST") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  const { message, chat_id } = req.body;

  const newMessage = {
    ...message,
    // * Replace client timestamp with server timestamp
    created_at: Date.now(),
  };
  // * Push to upstash redis db
  await client.hset(
    "chat:messages:" + chat_id,
    message.id,
    JSON.stringify(newMessage)
  );
  serverPusher.trigger("chat-messages-" + chat_id, "new-message", newMessage);

  res.status(200).json({ message: newMessage });
  await client.quit();
}
