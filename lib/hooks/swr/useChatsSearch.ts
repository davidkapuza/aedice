import { PrivateChat } from "@/core/types";
import useSWR, { Fetcher } from "swr";

export default function useChatsSearch(query: string | null) {
  const fetcher: Fetcher<{ chats: PrivateChat[] }, string> = ([url, query]) =>
    fetch(`${url}?q=${query}`).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR<{ chats: PrivateChat[] }>(
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
