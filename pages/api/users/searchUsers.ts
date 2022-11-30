// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "../../../common/lib/redis";

type Data =
  | {
      users: any;
    }
  | string;
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const q = Array.isArray(req.query.q)
    ? req.query.q.join("").toUpperCase()
    : req.query.q?.toUpperCase();
  if (!q) {
    res.status(400).send("Add query params");
    return;
  }

  const users = [];
  const idx = await client.zrank("users", q);
  if (idx != null) {
    const range = await client.zrange("users", idx, idx + 100);
    for (const el of range) {
      if (!el.startsWith(q)) {
        break;
      }
      if (el.endsWith("*")) {
        users.push(el.substring(0, el.length - 1));
      }
    }
  }
  
  res.status(200).json({ users });
}
