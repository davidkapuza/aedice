"use client";
import Airplane from "@core/icons/AirplaneIcon";
import { TMessage } from "@core/types/entities";
import getMessages from "@lib/services/chat/getMessages";
import IconButton from "@ui/IconButton/IconButton";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css";
import { usePathname } from "next/navigation";

function ChatInput() {
  const pathname = usePathname();
  // * Get chat id from url
  const chatId = pathname?.substring(pathname.lastIndexOf("/") + 1) || "";

  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const {
    data: messages,
    error,
    mutate,
  } = useSWR("/api/getMessages", () => getMessages(chatId));
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
      const data = await fetch("/api/chat/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, chatId }),
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
