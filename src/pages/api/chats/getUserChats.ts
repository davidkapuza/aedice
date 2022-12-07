// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";


type Data = {
  chats: string[];
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
  
  const chatsJson: string[] = await client.hvals("user:chats:" + req.query.q);
  const chats: string[] = chatsJson.map((chat) => JSON.parse(chat));

  res.status(200).json({ chats });
  await client.quit();
}
