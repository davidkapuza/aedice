"use client";
import { TypeMessage } from "@/core/types/entities";
import { getMessages, sendMessage } from "@/lib/services/client/messages";
import { User } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import AutosizeInput from "react-input-autosize";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css";

type Props = {
  user: User | undefined;
  chat_id: string;
};

function ChatInput({ user, chat_id }: Props) {
  const [input, setInput] = useState("");
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(`/api/chats/${chat_id}`, getMessages);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !user) return;
    const id = uuid();
    const message: TypeMessage = {
      id,
      text: input,
      created_at: Date.now(),
      username: user?.name!,
      image: user?.image!,
      sender_id: user?.id!,
    };
    setInput("");

    await mutate(() => sendMessage(chat_id, message, messages), {
      optimisticData: [...messages!, message],
      rollbackOnError: true,
    });
  };
  return (
    <form className="Chat-form" onSubmit={(e) => send(e)}>
      <Image
        src={
          user?.image ||
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
