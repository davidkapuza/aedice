import { clientPusher } from "@/core/pusher";
import type { ChatEntity } from "@/core/types/entities";
import { useEffect } from "react";
import useSWR from "swr";
import { getChats } from "../services/client/chats";

export function useChatsChannel(user_id: string) {
  const { data: chats, isLoading, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    clientPusher.signin()
    const channel = clientPusher.subscribe(`private-user-chats-${user_id}`);
    channel.bind("pusher:subscription_error", (error: any) => {
      const { status } = error;
      console.log(status);
    });
    channel.bind("chat-created", async (chat_id: string) => {
      if (chats.some((prev: ChatEntity) => prev.chat_id === chat_id)) return;
      mutate(getChats);
    });
    channel.bind("chat-removed", async (chat_id: string) => {
      mutate(getChats, {
        optimisticData: chats.filter(
          (chat: ChatEntity) => chat.chat_id !== chat_id
        ),
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      });
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chats, mutate, clientPusher]);

  return { chats, isLoading };
}
