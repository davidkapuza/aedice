"use client";
import type { Message as TypeMessage, PrivateChat, User } from "@/core/types";
import Message from "@/core/ui/Message/Message";
import usePusher from "@/lib/hooks/pusher/usePusher";
import useMessages from "@/lib/hooks/swr/useMessages";
import { useEffect, useRef } from "react";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User;
  chat: PrivateChat;
  messages: TypeMessage[];
};

function Chat({ user, chat, messages: prerenderedMessages }: Props) {
  const bottomRef = useRef<HTMLLIElement>(null);
  const { messages, mutate, error } = useMessages(chat.chat_id);
  const [events] = usePusher({
    channel: `presence-chat-room-messages-${chat.chat_id}`,
    events: ["new-message"],
  });
  useEffect(() => {
    if (events?.["new-message"]) {
      const newMessage = events["new-message"] as TypeMessage;
      if (messages?.find((msg) => msg.id === newMessage.id)) return;
      if (!messages) {
        mutate();
      } else {
        mutate({
          messages: [...messages!, newMessage],
        });
      }
    }
  }, [events]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [messages]);

  return (
    <>
      <ChatHeader user={user} chat={chat} />
      <ul className="Chat">
        {(messages || prerenderedMessages)?.map((message) => {
          const isOwner = user?.id === message?.sender_id;
          return (
            <Message key={message.id} message={message} isOwner={isOwner} />
          );
        })}
        <li ref={bottomRef}></li>
      </ul>
      <ChatInput user={user} chat_id={chat.chat_id} />
    </>
  );
}

export default Chat;
