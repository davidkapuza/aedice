"use client";

import { clientPusher } from "@/core/pusher";
import Message from "@/core/ui/Message/Message";
import { TypeMessage } from "@/lib/validations/message";
import { Session } from "next-auth";
import { useEffect } from "react";
import useSWR from "swr";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: any;
  prerenderedMessages?: TypeMessage[];
  chat_id: string;
};

async function getMessages(query: string) {
  const response = await fetch(query);
  if (!response?.ok) {
    // TODO add err handling in ui
    console.log("Err...");
    return;
  }
  const { messages } = await response.json();
  return messages;
}

function Chat({ prerenderedMessages, chat_id, user }: Props) {
  const query = `/api/chats/${chat_id}`;

  const { data: messages, error, mutate } = useSWR<TypeMessage[]>(query, getMessages);
  useEffect(() => {
    const channel = clientPusher.subscribe("chat-messages-" + chat_id);
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

  return (
    <div className="Chat">
      {(messages || prerenderedMessages)?.map((message: TypeMessage) => {
        const isOwner = user?.email === message.email;
        return <Message key={message.id} message={message} isOwner={isOwner} />;
      })}
      <ChatInput user={user} chat_id={chat_id} />
    </div>
  );
}

export default Chat;
