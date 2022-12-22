import { clientPusher } from "@/core/pusher";
import { TypeMessage } from "@/core/types/entities";
import { useEffect } from "react";
import useSWR from "swr";
import { getMessages } from "../services/client/messages";

export function useMessagesChannel(chat_id: string) {
  const query = `/api/chats/${chat_id}`;

  const {
    data: messages,
    error,
    mutate,
  } = useSWR<TypeMessage[]>(query, getMessages);
  useEffect(() => {
    const channel = clientPusher.subscribe(`presence-chat-room-messages-${chat_id}`);
    channel.bind("pusher:subscription_error", (error: any) => {
      var { status } = error;
      console.log(status);
    });
    channel.bind("new-message", async (message: TypeMessage) => {
      if (messages?.find((msg) => msg.id === message.id)) return;
      if (!messages) {
        mutate(() => getMessages(query));
      } else {
        mutate(() => getMessages(query), {
          optimisticData: [...messages!, message],
          populateCache: true,
          revalidate: false,
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
