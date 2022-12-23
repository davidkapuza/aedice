import { clientPusher } from "@/core/pusher";
import { useEffect } from "react";
import useSWR from "swr";
import { getChats } from "../services/client/chats";

export function useChatsChannel(user_id: string) {
  const { data: chats, isLoading, mutate } = useSWR("api/chats", getChats);
  useEffect(() => {
    const channel = clientPusher.subscribe(`private-user-chats-${user_id}`);
    channel.bind("pusher:subscription_error", (error: Error) => {
      console.log(error.message);
    });
    channel.bind("chat-created", async (chat_id: string) => {
      if (chats?.some((prev) => prev.chat_id === chat_id)) return;
      mutate(getChats);
    });
    channel.bind("chat-removed", async (chat_id: string) => {
      mutate(getChats, {
        optimisticData: chats?.filter((chat) => chat.chat_id !== chat_id),
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
