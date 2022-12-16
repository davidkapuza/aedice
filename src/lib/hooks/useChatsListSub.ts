import { clientPusher } from "@/core/pusher";
import { useEffect } from "react";
import useSWR from "swr";
import { getChats } from "../services/client/chats";

export function useChatsListSub(user_id: string) {
  const { data: chats, error, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    const channel = clientPusher.subscribe(`user-chats-${user_id}`);
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

  return { chats };
}
