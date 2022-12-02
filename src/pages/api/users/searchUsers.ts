// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis"

type Data = {
  users: string[];
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {

  const client = new Redis(process.env.REDIS_URL!);
  const q = Array.isArray(req.query.q)
    ? req.query.q.join("").toUpperCase()
    : req.query.q?.toUpperCase();
  if (!q) return;

  const users = [];
  const idx = await client.zrank("users", q);
  if (idx != null) {
    const range = await client.zrange("users", idx, idx + 100);
    for (const el of range) {
      if (!el.startsWith(q)) {
        break;
      }
      if (el.endsWith("*")) {
        users.push(JSON.parse(el.split("*")[1]));
      }
    }
  }
  res.status(200).json({ users });
  await client.quit();
}
