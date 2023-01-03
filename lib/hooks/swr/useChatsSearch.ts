import { Chat } from "@/core/types";
import useSWR, { Fetcher } from "swr";

export default function useChatsSearch(query: string | null) {
  const fetcher: Fetcher<{ chats: Chat[] }, string> = ([url, query]) =>
    fetch(`${url}?q=${query}`).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR<{ chats: Chat[] }>(
    [`/api/chats/search`, query],
    query?.length! > 2 ? fetcher : null,
    { keepPreviousData: true }
  );
  return {
    chats: data?.chats,
    error,
    isLoading,
    mutate,
  };
}
