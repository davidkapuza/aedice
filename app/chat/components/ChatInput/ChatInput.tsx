"use client";
import type { Message, User } from "@/core/types";
import Avatar from "@/core/ui/Avatar/Avatar";
import { MessageTextSchema } from "@/core/validations";
import useMessages from "@/lib/hooks/swr/useMessages";
import { useState } from "react";
import AutosizeInput from "react-input-autosize";
import { v4 as uuid } from "uuid";
import "./ChatInput.styles.css";

type Props = {
  user: User;
  chat_id: string;
};

async function sendMessage(
  chat_id: string,
  message: Message,
  messages: Message[]
) {
  const response = await fetch(`/api/chats/${chat_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  const data: { message: Message } = await response.json();
  return { messages: [...messages!, data.message] };
}

function ChatInput({ user, chat_id }: Props) {
  const [input, setInput] = useState<string>("");
  const { messages, mutate } = useMessages(chat_id);

  const send = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!MessageTextSchema.safeParse(input).success || !user) return;
    const message: Message = {
      id: uuid(),
      text: input,
      created_at: Date.now(),
      username: user?.name,
      image: user?.image,
      sender_id: user?.id,
    };
    setInput("");

    await mutate(() => sendMessage(chat_id, message, messages!), {
      optimisticData: { messages: [...messages!, message] },
      populateCache(messages) {
        return messages!;
      },
      rollbackOnError: true,
    });
  };
  return (
    <form className="ChatForm" onSubmit={(e) => send(e)}>
      <Avatar src={user?.image} className="w-5 h-5" />
      <AutosizeInput
        type="text"
        autoComplete="off"
        placeholder="Type..."
        value={input}
        className="ChatInput"
        onChange={(e) => setInput(e.target.value)}
      />
    </form>
  );
}

export default ChatInput;
