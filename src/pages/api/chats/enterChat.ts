// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@core/redis";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "@api/auth/[...nextauth]";

type Data = {
  chatOwner: any;
};
type Error = {
  body: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const { chatOwner } = req.body;
  const session = await unstable_getServerSession(authOptions);
  const ownerJson = JSON.stringify(chatOwner);
  const userJson = JSON.stringify(session!.user);
  if (session?.user) {
    await client.hset("chat:members:" + chatOwner.chat_id, session.user.uid!, userJson);
    // * Chat for self
    await client.hset("user:chats:" + session.user.uid, chatOwner.chat_id, ownerJson);
    // * Chat for owner
    await client.hset("user:chats:" + chatOwner.uid, session.user.chat_id!, userJson);
  
}

  res.status(200).json({ chatOwner });
  await client.quit();
}
