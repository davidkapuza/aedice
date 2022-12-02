// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis"

type Data = {
  chatId: string;
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const { chatId, user } = req.body
  console.log(chatId, user)
  const client = new Redis(process.env.REDIS_URL!);
  
  await client.zadd("chat:members:" + chatId, 0, JSON.stringify(user));

  res.status(200).json({ chatId });
  await client.quit();
}
