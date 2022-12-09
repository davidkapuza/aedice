// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { authOptions } from "@api/auth/[...nextauth]";
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

type Data = {
  body: string;
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {

  const { chatOwner } = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);
  const userJson = JSON.stringify(session!.user);
  const membersJson = JSON.stringify([session?.user, chatOwner])

  if (session?.user) {
    const client = new Redis(process.env.REDIS_URL!, {
      enableAutoPipelining: true,
    });
    // TODO add support for multiple change members
    // ? Update user chats list
    await client.hset("user:chats:" + session.user.uid, chatOwner.chat_id , membersJson);
    // ? Update chat for chat owner
    await client.hset("user:chats:" + chatOwner.uid, chatOwner.chat_id, membersJson);

    await client.quit()
    // serverPusher.trigger("chat-members-" + chatOwner.chat_id, "new-member", session?.user);
    // serverPusher.trigger("user-chats-" + session.user.uid, "new-chat", chatMembers);
  }

  

  res.status(200).json({ body: "Joined" });
}
