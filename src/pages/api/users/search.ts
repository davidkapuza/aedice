// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withMethods } from "@/core/middlewares/with-methods";
import db, { usersRepository } from "@/core/redis";
import { TypeUser, userSchema } from "@/core/schemas/user";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  users: TypeUser[];
};
type Error = {
  error: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (req.method === "GET") {
    const q = Array.isArray(req.query.q) ? req.query.q.join("") : req.query.q;

    if (!q) {
      res.status(400).json({
        error: "Search can not be empty...",
      });
    } else if (q.length < 50) {

      const users = await usersRepository
        .search()
        .where("name")
        .match(q)
        .returnAll();
      res.status(200).json({ users });
    } else {
      res.status(400).json({
        error: "Max 50 characters please.",
      });
    }
  }
}
export default withMethods(["GET"], handler);
