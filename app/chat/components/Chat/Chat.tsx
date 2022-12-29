"use client";
import type { Message as TypeMessage, User } from "@/core/types";
import Message from "@/core/ui/Message/Message";
import usePusherChannel from "@/lib/hooks/usePusherChannel";
import { getMessages } from "@/lib/services/client/messages";
import { useEffect, useRef } from "react";
import useSWR from "swr";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User;
  chat_id: string;
};

function Chat({ chat_id, user }: Props) {
  const query = `/api/chats/${chat_id}`;
  const bottomRef = useRef<HTMLSpanElement>(null);
  const { data: messages, error, mutate } = useSWR(query, getMessages);
  const [events] = usePusherChannel(`presence-chat-room-messages-${chat_id}`, [
    "new-message",
  ]);
  useEffect(() => {
    if (events?.["new-message"]) {
      if (messages?.find((msg) => msg.id === events["new-message"].id)) return;
      if (!messages) {
        mutate(() => getMessages(query));
      } else {
        mutate(() => getMessages(query), {
          optimisticData: [
            ...messages!,
            events?.["new-message"] as TypeMessage,
          ],
          populateCache: true,
          revalidate: false,
          rollbackOnError: true,
        });
      }
    }
  }, [events]);

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
