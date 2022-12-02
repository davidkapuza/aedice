"use client";
import Airplane from "@core/icons/AirplaneIcon";
import { Message } from "@core/types";
import getMessages from "@lib/services/messages/getMessages";
import IconButton from "@ui/IconButton/IconButton";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css"

function ChatInput() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(session ? "/api/getMessages" : null, getMessages);
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !session) return;

    const msgToSend = input;

    setInput("");
    const id = uuid();
    const message: Message = {
      id,
      message: msgToSend,
      created_at: Date.now(),
      username: session?.user?.name!,
      profilePic: session?.user?.image!,
      email: session?.user?.email!,
    };

    const uploadMsgToUpstash = async () => {
      const data = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }).then((res) => res.json());
      return [...messages!, data.message];
    };
    await mutate(uploadMsgToUpstash, {
      optimisticData: [...messages!, message],
      rollbackOnError: true,
    });
  };
  return (
    <form className="Chat-form" onSubmit={(e) => sendMessage(e)}>
      <input
        value={input}
        disabled={!session}
        placeholder="Enter message..."
        type="text"
        className="Chat-input"
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <IconButton
        type="submit"
        disabled={!input}
        styles="disabled:hidden disabled:cursor-not-allowed bg-transparent"
        icon={<Airplane />}
      />
    </form>
  );
}

export default ChatInput;
