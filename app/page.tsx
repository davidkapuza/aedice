import React from "react";
import { Message } from "../typings";
import MessageInput from "./MessageInput";
import MessagesList from "./MessagesList";

async function Home() {
  const data = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000/"}/api/getMessages`).then(
    (res) => res.json()
  );
  const messages: Message[] = data.messages;
  return (
    <main>
      <MessagesList initialMessages={messages} />
      <MessageInput />
    </main>
  );
}

export default Home;
