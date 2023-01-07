import type { PrivateChat, PublicChat } from "@/core/types";
import useSWR, { Fetcher } from "swr";

export default function useChats() {
  const fetcher: Fetcher<{ chats: PrivateChat[] }, string> = (url) =>
    fetch(url).then((res) => res.json());

  const { data, isLoading, mutate } = useSWR<{ chats: PrivateChat[] }>(
    "/api/chats",
    fetcher
  );

  return {
    chats: data?.chats,
    isLoading,
    mutate,
  };
}
