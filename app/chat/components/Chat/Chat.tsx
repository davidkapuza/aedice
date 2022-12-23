"use client";
import { clientPusher } from "@/core/pusher";
import type { User } from "@/core/types";
import Message from "@/core/ui/Message/Message";
import { useMessagesChannel } from "@/lib/hooks/channels/useMessagesChannel";
import { useEffect, useRef } from "react";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User;
  chat_id: string;
};

function Chat({ chat_id, user }: Props) {
  const bottomRef = useRef<HTMLSpanElement>(null);
  const { messages } = useMessagesChannel(chat_id);

  useEffect(() => {
    clientPusher.connection.bind("state_change", function (states: any) {
      console.log("Channels current state is >> " + states.current);
    });
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="Chat-layout">
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
