"use client";
import type { PrivateChat, User } from "@/core/types";
import usePusherEvents from "@/lib/hooks/pusher/usePusherEvents";
import useChats from "@/lib/hooks/swr/useChats";
import { useEffect } from "react";
import SubscribedChatCard from "../SubscribedChatCard/SubscribedChatCard";
import "./ChatsList.styles.css";

type Props = {
  user: User;
};

function ChatsList({ user }: Props) {
  const [events] = usePusherEvents(`private-user-chats-${user.id}`, [
    "chat-created",
    "chat-removed",
  ]);

  const { chats, isLoading, mutate } = useChats();
  useEffect(() => {
    if (chats) {
      if (events?.["chat-created"]) {
        const newChat = events["chat-created"] as PrivateChat;
        mutate({ chats: [...chats!, newChat] });
      } else if (events?.["chat-removed"]) {
        mutate({
          chats: chats.filter(
            (chat) => chat.chat_id !== events?.["chat-removed"].chat_id
          ),
        });
      }
    } else {
      mutate();
    }
  }, [events]);

  return (
    <ul className="Chats-ul">
      <div className="py-3 ">
        <h1 className="font-sans font-medium dark:text-white">Chats</h1>
        <p className="text-xs text-gray-500">{"[ Feature coming soon... ]"}</p>
      </div>
      {chats?.map((chat) => {
        return (
          <SubscribedChatCard key={chat.chat_id} chat={chat} user={user} />
        );
      })}
      {isLoading ?? <p className="text-sm text-white">Loading...</p>}
    </ul>
  );
}

export default ChatsList;
