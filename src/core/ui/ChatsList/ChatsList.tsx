"use client";
import { clientPusher } from "@/core/pusher";
import { getChats } from "@/lib/services/client/chats";
import { useEffect } from "react";
import useSWR from "swr";
import ChatsListItem from "../ChatsListItem/ChatsListItem";

type Props = {
  prerenderedChats?: string[];
  user: any;
};

function ChatsList({ prerenderedChats, user }: Props) {
  const { data: chats, error, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    const channel = clientPusher.subscribe(`user-chats-${user.id}`);
    channel.bind("new-chat", async (chat: any) => {
      if (!chat) {
        mutate(getChats);
      } else {
        mutate(getChats, {
          optimisticData: [chat, ...chats],
          rollbackOnError: true,
        });
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chats, mutate, clientPusher]);

  return (
    <ul>
      <h1 className="py-3 dark:text-white">Chats.</h1>
      {(chats || prerenderedChats)?.map(({ members, chat_id }: any) => {
        return (
          <ChatsListItem key={chat_id} members={members} chat_id={chat_id} />
        );
      })}
    </ul>
  );
}

export default ChatsList;
