"use client";

import { TypeMessage } from "@/lib/validations/message";
import { Session } from "next-auth";
import { useState } from "react";
import AutosizeInput from "react-input-autosize";
import useSWR from "swr";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css";
import Image from "next/image";

type Props = {
  session: Session | null;
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

function ChatInput({ session, chat_id }: Props) {
  const [input, setInput] = useState("");
  const {
    data: messages,
    error,
    mutate,
  } = useSWR(`/api/chats/${chat_id}`, getMessages);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || !session) return;
    const id = uuid();
    const message: TypeMessage = {
      id,
      text: input,
      created_at: Date.now(),
      username: session?.user?.name!,
      image: session?.user?.image!,
      email: session?.user?.email!,
    };
    setInput("");
    
    const uploadMsgToUpstash = async () => {
      const data = await fetch(`/api/chats/${chat_id}`, {
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
