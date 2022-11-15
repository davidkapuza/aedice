import { unstable_getServerSession } from "next-auth";
import React from "react";
import { Message } from "../typings";
import MessageInput from "./MessageInput";
import MessagesList from "./MessagesList";
import Providers from "./providers";

async function Home() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"}/api/getMessages`
  ).then((res) => res.json());
  const session = await unstable_getServerSession();
  const messages: Message[] = data.messages;
  return (
    <Providers session={session}>
      <main>
        <MessagesList initialMessages={messages} />
        <MessageInput session={session} />
      </main>
    </Providers>
  );
}

export default Home;
