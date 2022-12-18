"use client";
import { ChatEntity } from "@/core/types/entities";
import { useChatsChannel } from "@/lib/hooks/useChatsChannel";
import { User } from "next-auth";
import SubscribedChatCard from "../SubscribedChatCard/SubscribedChatCard";
import "./ChatsList.styles.css";

type Props = {
  prerenderedChats?: ChatEntity[];
  user: User;
};

function ChatsList({ prerenderedChats, user }: Props) {
  const { chats } = useChatsChannel(user.id);
  return (
    <ul className="Chats-ul">
      <div className="py-3 ">
        <h1 className="font-sans font-medium dark:text-white">Chats</h1>
        <p className="text-xs text-gray-500">{"[ Feature coming soon... ]"}</p>
      </div>
      {(chats || prerenderedChats)?.map((chat: ChatEntity) => {
        return (
          <SubscribedChatCard key={chat.chat_id} chat={chat}/>
        );
      })}
    </ul>
  );
}

export default ChatsList;
