"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import fetcher from "../lib/fetchMessages";
import { clientPusher } from "../pusher";
import { Message } from "../typings";

function MessagesList() {
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);

  useEffect(() => {
    const channel = clientPusher.subscribe("messages");
    channel.bind("new-message", async (data: Message) => {
      // * if sender is a client - no need to update cache
      if (messages?.find((message) => message.id === data.id)) return;
      
      if (!messages) {
        mutate(fetcher);
      } else {
        mutate(fetcher, {
          optimisticData: [data, ...messages!],
          rollbackOnError: true,
        });
      }
    });
  }, [messages, mutate, clientPusher]);

  return (
    <div>
      {messages?.map((message) => {
        let isUser = true;
        return (
          <div key={message.id} className={`flex w-fit ${isUser && "ml-auto"}`}>
            <p>{message.message}</p>
          </div>
        );
      })}
    </div>
  );
}

export default MessagesList;
