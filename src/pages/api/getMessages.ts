// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Message } from "@core/types";
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";


type Data = {
  messages: Message[];
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  
  if (req.method !== "GET") {
    res.status(405).json({ body: "Method Not Allowed" });
    return;
  }
  const client = new Redis(process.env.REDIS_URL!);


  const messagesRes: string[] = await client.hvals("messages");
  const messages: Message[] = messagesRes
    .map((message) => JSON.parse(message))
    .sort((a, b) => a.created_at - b.created_at);

  res.status(200).json({ messages });
  await client.quit();
}
