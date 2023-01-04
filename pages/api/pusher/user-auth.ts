import { authOptions } from "@/core/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import Pusher from "pusher";

export const serverPusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
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
