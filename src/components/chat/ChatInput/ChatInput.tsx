"use client";
import { TMessage } from "@core/types/entities";
import { getMessagesById } from "@lib/services/client/messages";
import { Session } from "next-auth";
import Image from "next/image";
import React, { useState } from "react";
import AutosizeInput from "react-input-autosize";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css";

type Props = {
  session: Session | null;
  chat_id: string;
};

function ChatInput({ session, chat_id }: Props) {

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
      <Image
        src={
          session?.user.image ||
          "https://avatars.dicebear.com/api/open-peeps/random-seed.svg"
        }
        height={20}
        width={20}
        alt="Avatar"
        className="Avatar"
      />
      <AutosizeInput
        type="text"
        autoComplete="off"
        placeholder="Type..."
        value={input}
        className="Chat-input"
        onChange={(e) => setInput(e.target.value)}
      />
    </form>
  );
}

export default ChatInput;
