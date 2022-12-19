import { clientPusher } from "@/core/pusher";
import type { ChatEntity } from "@/core/types/entities";
import { useEffect } from "react";
import useSWR from "swr";
import { getChats } from "../services/client/chats";

export function useChatsChannel(user_id: string) {
  const { data: chats, error, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    const channel = clientPusher.subscribe(`private-user-chats-${user_id}`);
    channel.bind("chat-added", async (chat: ChatEntity) => {
      if (chats.some((prev: ChatEntity) => prev.chat_id === chat.chat_id)) return;
      if (!chat) {
        mutate(getChats);
      } else {
        mutate(getChats, {
          optimisticData: [...chats, chat],
          rollbackOnError: true,
        });
      }
    });
    channel.bind("chat-removed", async (chat_id: string) => {
      mutate(getChats, {
        optimisticData: chats.filter((chat: ChatEntity) => chat.chat_id !== chat_id),
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
