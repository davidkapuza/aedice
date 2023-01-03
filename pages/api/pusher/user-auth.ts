import { authOptions } from "@/core/auth";
// import { serverPusher } from "@/core/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import Pusher from "pusher";

const serverPusher = new Pusher({
  appId: process.env.APP_ID || process.env.PUSHER_APP_ID!,
  key: process.env.KEY! || process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.SECRET! || process.env.PUSHER_SECRET!,
  cluster: process.env.CLUSTER! || "eu",
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  try {
    const socketId = req.body.socket_id;
    const user = {
      id: session.user.id,
      user_info: {
        name: session.user.name,
      },
    };
    const authResponse = serverPusher.authenticateUser(socketId, user);
    return res.send(authResponse);
  } catch (error) {
    return res.status(403).end();
  }
}

export default handler;
