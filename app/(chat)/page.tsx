import { unstable_getServerSession } from "next-auth";
import React from "react";
import Header from "../../common/components/Header";
import { MessageType } from "../../typings";
import MessageInput from "./components/MessageInput";
import MessagesList from "./components/MessagesList";

async function ChatPage() {
  const data = await fetch(
    `${
      process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000/"
    }/api/getMessages`
  ).then((res) => res.json());
  const messages: MessageType[] = data.messages;
  const session = await unstable_getServerSession();
  return (
    <div className="chat-container">
      <Header />
      <MessagesList initialMessages={messages} />
      <MessageInput session={session} />
    </div>
  );
}

export default ChatPage;
