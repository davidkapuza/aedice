"use client";

import React from "react";
import useSWR from "swr";
import fetcher from "../lib/fetchMessages";

function MessagesList() {
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);

  return (
    <div>
      {messages?.map((message) => (
        <div key={message.id}>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
}

export default MessagesList;
