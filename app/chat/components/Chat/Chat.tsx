"use client";
import type { User } from "@/core/types";
import Message from "@/core/ui/Message/Message";
import useMessages from "@/lib/hooks/swr/useMessages";
import { useEffect, useRef } from "react";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User;
  chat_id: string;
};

function Chat({ chat_id, user }: Props) {
  const bottomRef = useRef<HTMLSpanElement>(null);
  const { messages } = useMessages(chat_id);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="ChatLayout">
      <ul className="Chat">
        {messages?.map((message) => {
          const isOwner = user?.id === message.sender_id;
          return (
            <Message key={message.id} message={message} isOwner={isOwner} />
          );
        })}
      </ul>
      <span ref={bottomRef}></span>
      <ChatInput user={user} chat_id={chat_id} />
    </main>
  );
}

export default Chat;
