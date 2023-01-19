import { Message } from "@/core/types";
import { toast } from "react-toastify";
import useSWR, { Fetcher } from "swr";

export default function useMessages(chat_id: string) {
  const fetcher: Fetcher<{ messages: Message[] }, string> = async ([
    query,
    chat_id,
  ]) => {
    const response = await fetch(`${query}/${chat_id}`);
    if (!response.ok) {
      const error = await response.json();
      return toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    const messages = await response.json();
    return messages;
  };

  const { data, error, isLoading, mutate } = useSWR<{ messages: Message[] }>(
    [`/api/messages`, chat_id],
    fetcher
  );
  return {
    messages: data?.messages,
    error,
    isLoading,
    mutate,
  };
}
