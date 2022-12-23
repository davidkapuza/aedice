"use client";
import type { User } from "@/core/types";
import { useChatsChannel } from "@/lib/hooks/useChatsChannel";
import SubscribedChatCard from "../SubscribedChatCard/SubscribedChatCard";
import "./ChatsList.styles.css";

type Props = {
  user: User;
};

function ChatsList({ user }: Props) {
  const { chats, isLoading } = useChatsChannel(user.id);
  // preload("api/chats", getChats);
  return (
    <ul className="Chats-ul">
      <div className="py-3 ">
        <h1 className="font-sans font-medium dark:text-white">Chats</h1>
        <p className="text-xs text-gray-500">{"[ Feature coming soon... ]"}</p>
      </div>
      {chats?.map((chat) => {
        return <SubscribedChatCard key={chat.chat_id} chat={chat} />;
      })}
      {isLoading ?? <p className="text-sm text-white">Loading...</p>}
    </ul>
  );
}

export default ChatsList;
