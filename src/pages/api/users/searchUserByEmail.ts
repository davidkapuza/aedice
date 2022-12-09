// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  users: string[];
};
type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const q = Array.isArray(req.query.q)
    ? req.query.q.join("").toUpperCase()
    : req.query.q?.toUpperCase();
  if (!q) {
    res.status(400).json({
      error: "Search can not be empty...",
    });
  } else if (q.length < 50) {
    const client = new Redis(process.env.REDIS_URL!, {
      enableAutoPipelining: true,
    });

    const users = [];
    const idx = await client.zrank("users:search", q);
    if (idx != null) {
      const range = await client.zrange("users:search", idx, idx + 100);
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
  } else {
    res.status(400).json({
      error: "Max 50 characters please.",
    });
  }
}
