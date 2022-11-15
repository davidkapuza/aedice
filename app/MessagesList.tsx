"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import useSWR from "swr";
import fetcher from "../lib/fetchMessages";
import { clientPusher } from "../pusher";
import { Message } from "../typings";
import TimeAgo from "react-timeago";

type Props = {
  initialMessages: Message[];
};

function MessagesList({ initialMessages }: Props) {
  const { data: session } = useSession();
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
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages, mutate, clientPusher]);

  return (
    <div>
      {(messages || initialMessages)?.map((message) => {
        const isUser = session?.user?.email === message.email;
        return (
          <div key={message.id} className={`flex w-fit ${isUser && "ml-auto"}`}>
            <div className="flex flex-col">
              <p>{message.message}</p>
              <TimeAgo className="text-sm text-gray-400" date={new Date(message.created_at)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessagesList;
