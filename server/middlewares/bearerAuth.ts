import type { NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../services/auth";
import type { RequestWithUser } from "../../core/types";

const bearerAuth = async (
  req: RequestWithUser,
  res: NextApiResponse,
  next: () => Promise<void> | void
) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    req.user = session.user;
    await next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default bearerAuth;
