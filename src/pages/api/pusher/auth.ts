import { authOptions } from "@/core/auth";
import { withChat } from "@/core/middlewares/with-chat";
import { serverPusher } from "@/core/pusher";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  }
  try {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const presenceData = {
      user_id: session.user.id,
      user_info: { name: session.user.name },
    };
    const authResponse = serverPusher.authorizeChannel(
      socketId,
      channel,
      presenceData
    );
    res.send(authResponse);
  } catch (error) {
    return res.status(403).end();
  }
}

export default handler;
