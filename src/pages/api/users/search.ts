// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authOptions } from "@/core/auth";
import { withMethods } from "@/core/middlewares/with-methods";
import db, { usersRepository } from "@/core/redis";
import { TypeUser, userSchema } from "@/core/schemas/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

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
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!q) {
      res.status(400).json({
        error: "Search can not be empty...",
      });
    } else if (q.length < 50) {
      const users = await usersRepository
        .search()
        .where("name")
        // .not.eq(session?.user.id)
        // .and("name")
        .matches(q + "*")
        .return.all();
      res.status(200).json({ users });
    } else {
      res.status(400).json({
        error: "Max 50 characters please.",
      });
    }
  }
}
export default withMethods(["GET"], handler);
