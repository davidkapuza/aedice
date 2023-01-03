import { Message } from "@/core/types";
import useSWR, { Fetcher } from "swr";

export default function useMessages(chat_id: string) {
  const fetcher: Fetcher<{ messages: Message[] }, string> = ([
    query,
    chat_id,
  ]) => fetch(`${query}/${chat_id}`).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR<{ messages: Message[] }>(
    [`/api/chats`, chat_id],
    fetcher
  );
  return {
    messages: data?.messages,
    error,
    isLoading,
    mutate,
  };
}
