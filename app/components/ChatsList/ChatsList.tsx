"use client";
import type { Chat, User } from "@/core/types";
import usePusherEvents from "@/lib/hooks/usePusherEvents";
import { getChats } from "@/lib/services/client/chats";
import { useEffect } from "react";
import useSWR from "swr";
import SubscribedChatCard from "../SubscribedChatCard/SubscribedChatCard";
import "./ChatsList.styles.css";

type Props = {
  user: User;
};

function ChatsList({ user }: Props) {
  const [events, setEvent] = usePusherEvents(`private-user-chats-${user.id}`, [
    "chat-created",
    "chat-removed",
  ]);

  const { data: chats, isLoading, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    console.log(events?.["chat-created"]);
    if (events?.["chat-created"]) {
      mutate(getChats, {
        optimisticData: [...chats!, events["chat-created"] as Chat],
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
    } else {
      mutate(getChats);
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
