// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@api/auth/[...nextauth]";
import Redis from "ioredis";

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
  const client = new Redis(process.env.REDIS_URL!, {
    enableAutoPipelining: true,
  });
  const { chatOwner } = req.body;
  const session = await unstable_getServerSession(req, res, authOptions);
  const userJson = JSON.stringify(session!.user);
  const membersJson = JSON.stringify({members: [session?.user, chatOwner], chat_id: chatOwner.chat_id})

  if (session?.user) {
    await client.hset("chat:members:" + chatOwner.chat_id, session.user.uid!, userJson);
    // * Add chat for self
    await client.hset("user:chats:" + session.user.uid, chatOwner.chat_id, membersJson);
    // * Add chat for owner
    await client.hset("user:chats:" + chatOwner.uid, chatOwner.chat_id!, membersJson);
  
}

  res.status(200).json({ body: "Joined" });
  await client.quit();
}
