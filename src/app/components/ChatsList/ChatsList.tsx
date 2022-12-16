"use client";
import { useChatsListSub } from "@/lib/hooks/useChatsListSub";
import ChatsListItem from "../ChatsListItem/ChatsListItem";
import "./ChatsList.styles.css";

type Props = {
  prerenderedChats?: string[];
  user: any;
};

function ChatsList({ prerenderedChats, user }: Props) {
  const { chats } = useChatsListSub(user.id);
  return (
    <ul className="Chats-ul">
      <h1 className="py-3 dark:text-white">Chats.</h1>
      {(chats || prerenderedChats)?.map((chat: any) => {
        return <ChatsListItem key={chat.id} chat={chat} />;
      })}
    </ul>
  );
}

export default ChatsList;
