import { clientPusher } from "@/core/pusher";
import { TypeMessage } from "@/core/schemas/message";
import { useEffect } from "react";
import useSWR from "swr";
import { getMessages } from "../services/client/messages";

export function useChatMessages(chat_id: string) {
  const query = `/api/chats/${chat_id}`;

  const {
    data: messages,
    error,
    mutate,
  } = useSWR<TypeMessage[]>(query, getMessages);
  useEffect(() => {
    const channel = clientPusher.subscribe(`chat-update-${chat_id}`);
    channel.bind("new-message", async (message: TypeMessage) => {
      if (messages?.find((msg) => msg.id === message.id)) return;
      if (!messages) {
        mutate(() => getMessages(query));
      } else {
        mutate(() => getMessages(query), {
          optimisticData: [...messages!, message],
          rollbackOnError: true,
        });
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages, mutate, clientPusher]);
  return { messages };
}
