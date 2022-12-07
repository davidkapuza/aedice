"use client";
import { clientPusher } from "@core/pusher/index";
import { TMessage } from "@core/types/entities";
import { getMessagesById } from "@lib/services/client/messages";
import { Message } from "@ui/index";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  // session: Session | null;
  initialMessages?: TMessage[];
  chat_id: string;
};

function Chat({ initialMessages, chat_id, /* session */ }: Props) {
  const query = `/api/messages/getMessagesById?q=${chat_id}`;

  const { data: messages, error, mutate } = useSWR(query, getMessagesById);
  useEffect(() => {
    const channel = clientPusher.subscribe("chat-messages-" + chat_id);
    channel.bind("new-message", async (message: TMessage) => {
      if (messages?.find((message) => message.id === message.id)) return;

      if (!messages) {
        mutate(() => getMessagesById(query));
      } else {
        mutate(() => getMessagesById(query), {
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

  return (
    <div className="Chat">
      {(messages || initialMessages)?.map((message) => {
        const isOwner = true /* session?.user?.email === message.email; */
        return <Message key={message.id} message={message} isOwner={isOwner} />;
      })}
      <ChatInput /* session={session} */ chat_id={chat_id} />
    </div>
  );
}

export default Chat;
