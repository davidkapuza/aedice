import { clientPusher } from "@/core/pusher";
import { useEffect } from "react";
import useSWR from "swr";
import { getChats } from "../services/client/chats";

export function useChatsChannel(user_id: string) {
  const { data: chats, error, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    const channel = clientPusher.subscribe(`user-chats-${user_id}`);
    channel.bind("chat-added", async (chat: any) => {
      if (chats.some((prev: any) => prev.id === chat.id)) return;
      if (!chat) {
        mutate(getChats);
      } else {
        mutate(getChats, {
          optimisticData: [chat, ...chats],
          rollbackOnError: true,
        });
      }
    });
    channel.bind("chat-removed", async (chat_id: any) => {
      mutate(getChats, {
        optimisticData: chats.filter((chat: any) => chat.id !== chat_id),
        rollbackOnError: true,
      });
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chats, mutate, clientPusher]);

  return { chats };
}
