// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";
import { serverPusher } from "@core/pusher";
import { Message } from "@core/types";

type Data = {
  message: Message;
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
  const client = new Redis(process.env.REDIS_URL!);

  const { message } = req.body;

  const newMessage = {
    ...message,
    // * Replace client timestamp with server timestamp
    created_at: Date.now(),
  };
  // * Push to upstash redis db
  await client.hset("messages", message.id, JSON.stringify(newMessage));
  serverPusher.trigger("messages", "new-message", newMessage);

  res.status(200).json({ message: newMessage });
  await client.quit();
}
