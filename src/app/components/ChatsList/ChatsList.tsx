"use client";
import { useChatsChannel } from "@/lib/hooks/useChatsChannel";
import ChatsListItem from "../ChatsListItem/ChatsListItem";
import "./ChatsList.styles.css";

type Props = {
  prerenderedChats?: string[];
  user: any;
};

function ChatsList({ prerenderedChats, user }: Props) {
  const { chats } = useChatsChannel(user.id);
  return (
    <ul className="Chats-ul">
      <div className="py-3 ">
        <h1 className="font-sans font-medium dark:text-white">Chats</h1>
        <p className="text-xs text-gray-500">You have 0 unread messages.</p>
      </div>
      {(chats || prerenderedChats)?.map((chat: any) => {
        return <ChatsListItem key={chat.id} chat={chat} />;
      })}
    </ul>
  );
}

export default ChatsList;
