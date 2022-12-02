"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import useSWR from "swr";
import getMessages from "@lib/services/messages/getMessages";
import { clientPusher } from "@core/pusher/index";
import { Message } from "@ui/index";
import { Message as MessageType } from "@core/types";
import "./Chat.styles.css"

type Props = {
  initialMessages?: MessageType[];
};

function Chat({ initialMessages }: Props) {
  const { data: session } = useSession();
  const {
    data: messages,
    error,
    mutate,
  } = useSWR("/api/getMessages", getMessages);

  useEffect(() => {
    const channel = clientPusher.subscribe("messages");
    channel.bind("new-message", async (data: MessageType) => {
      // * if sender is a client - no need to update cache
      if (messages?.find((message) => message.id === data.id)) return;

      if (!messages) {
        mutate(getMessages);
      } else {
        mutate(getMessages, {
          optimisticData: [data, ...messages!],
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
