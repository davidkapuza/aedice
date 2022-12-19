"use client";
import { TypeMessage } from "@/core/types/entities";
import Message from "@/core/ui/Message/Message";
import { useMessagesChannel } from "@/lib/hooks/useMessagesChannel";
import { User } from "next-auth";
import { useEffect, useRef } from "react";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User | undefined;
  prerenderedMessages?: TypeMessage[];
  chat_id: string;
};

function Chat({ prerenderedMessages, chat_id, user }: Props) {
  const bottomRef = useRef<HTMLSpanElement>(null);
  const { messages } = useMessagesChannel(chat_id);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="Chat-layout">
      <ul className="Chat">
        {(messages || prerenderedMessages)?.map((message: TypeMessage) => {
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
