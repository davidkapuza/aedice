// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  chats: any;
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const client = new Redis(process.env.REDIS_URL!, {
    enableAutoPipelining: true,
  });

  const chatsHset = Object.entries(
    await client.hgetall("user:chats:" + req.query.q)
  );
  const chats = chatsHset.map(([chat_id, membersJson]) => ({
    chat_id,
    members: JSON.parse(membersJson),
  }));
  res.status(200).json({ chats });
  await client.quit();
}
