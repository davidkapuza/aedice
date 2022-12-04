"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import useSWR from "swr";
import getMessages from "@lib/services/chat/getMessages";
import { clientPusher } from "@core/pusher/index";
import { Message } from "@ui/index";

import "./Chat.styles.css"
import { TMessage } from "@core/types/entities";


type Props = {
  initialMessages?: TMessage[];
  chatId: string;
};

function Chat({ initialMessages, chatId }: Props) {
  const { data: session } = useSession();
  const {
    data: messages,
    error,
    mutate,
  } = useSWR("/api/getMessages", () => getMessages(chatId));

  useEffect(() => {
    const channel = clientPusher.subscribe("chat-messages-" + chatId);
    channel.bind("new-message", async (message: TMessage) => {

      // * if sender is a client - no need to update cache
      if (messages?.find((message) => message.id === message.id)) return;

      if (!messages) {
        mutate(() => getMessages(chatId));
      } else {
        mutate(() => getMessages(chatId), {
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
        const isOwner = session?.user?.email === message.email;
        return <Message key={message.id} message={message} isOwner={isOwner} />;
      })}
    </div>
  );
}

export default Chat;
