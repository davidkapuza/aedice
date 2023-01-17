"use client";
import type { PrivateChat, User } from "@/core/types";
import usePusher from "@/lib/hooks/pusher/usePusher";
import useChats from "@/lib/hooks/swr/useChats";
import { memo, useEffect } from "react";
import PrivateChatCard from "../PrivateChatCard/PrivateChatCard";
import "./ChatsList.styles.css";

type Props = {
  user: User;
  chats?: PrivateChat[];
};

function ChatsList({ user, chats: prerenderedChats }: Props) {
  const [events] = usePusher({
    channel: `private-user-chats-${user.id}`,
    events: ["chat-created", "chat-removed"],
  });

  const { chats, isLoading, mutate } = useChats();
  useEffect(() => {
    if (chats) {
      if (events?.["chat-created"]) {
        const newChat = events["chat-created"] as PrivateChat;
        if (chats.some(chat => chat.chat_id === newChat.chat_id)) return
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
    <ul className="ChatsList">
      <div className="py-3 ">
        <h1 className="font-sans font-medium dark:text-white">Chats</h1>
        <p className="text-sm text-gray-500">
          {"[ Feature in progress... 👷 ]"}
        </p>
      </div>
      {(chats || prerenderedChats)?.map((chat) => {
        return <PrivateChatCard key={chat.chat_id} chat={chat} user={user} />;
      })}
      {isLoading ?? <p className="text-sm text-white">Loading...</p>}
    </ul>
  );
}

export default memo(ChatsList);
