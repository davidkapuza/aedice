import { unstable_getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "@api/auth/[...nextauth]";
import { Message } from "@core/types";
import MessageInput from "@components/chat/MessageInput";
import MessagesList from "@components/chat/MessagesList";
import Header from "@components/layouts/Header/Header";
import getMessages from "@lib/chat/services/getMessages";

async function ChatPage() {
  const messages = await getMessages()
  const session = await unstable_getServerSession(authOptions);
  return (
    <div className="chat-container">
      <Header />
      <MessagesList initialMessages={messages} />
      <MessageInput session={session} />
    </div>
  );
}

export default ChatPage;
