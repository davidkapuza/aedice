"use client";
import Airplane from "@core/icons/AirplaneIcon";
import { TMessage } from "@core/types/entities";
import { getMessagesById } from "@lib/services/client/messages";
import IconButton from "@ui/IconButton/IconButton";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css";

type Props = {
  session: Session | null;
};

function ChatInput({ session }: Props) {
  const pathname = usePathname();
  // * Get chat id from url
  const chat_id = pathname?.substring(pathname.lastIndexOf("/") + 1) || "";

  const [input, setInput] = useState("");
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(`/api/messages/getMessagesById?q=${chat_id}`, getMessagesById);
  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !session) return;

    const msgToSend = input;

    setInput("");
    const id = uuid();
    const message: TMessage = {
      id,
      message: msgToSend,
      created_at: Date.now(),
      username: session?.user?.name!,
      image: session?.user?.image!,
      email: session?.user?.email!,
    };

    const uploadMsgToUpstash = async () => {
      const data = await fetch("/api/messages/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, chat_id }),
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
