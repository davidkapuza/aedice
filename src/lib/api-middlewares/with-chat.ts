import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import * as z from "zod";
import { authOptions } from "../auth";
import redis from "../redis";

export const schema = z.object({
  chat_id: z.string(),
});

export function withChat(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      // TODO

      return handler(req, res);
    } catch (error) {
      return res.status(500).end();
    }
  };
}
