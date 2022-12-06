// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TMessage } from "@core/types/entities";
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";

type Data = {
  messages: TMessage[];
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
  const client = new Redis(process.env.REDIS_URL!, {
    enableAutoPipelining: true,
  });
  const chat: string[] = await client.hvals("chat:messages:" + req.query.q);
  const messages: TMessage[] = chat
    .map((message) => JSON.parse(message))
    .sort((a, b) => a.created_at - b.created_at);

  res.status(200).json({ messages });
  await client.quit();
}
