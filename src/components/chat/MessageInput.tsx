"use client";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "@core/types";
import useSWR from "swr";
import fetcher from "@lib/chat/services/getMessages";
import { unstable_getServerSession } from "next-auth";
import Airplane from "@core/icons/AirplaneIcon";
import IconButton from "@ui/IconButton/IconButton";

type Props = {
  session: Awaited<ReturnType<typeof unstable_getServerSession>>;
};

function MessageInput({ session }: Props) {
  const [input, setInput] = useState("");
  const { data: messages, error, mutate } = useSWR("/api/getMessages", fetcher);
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
    <form className="bottom-bar" onSubmit={(e) => sendMessage(e)}>
      <input
        value={input}
        disabled={!session}
        placeholder="Enter message..."
        type="text"
        className="bottom-bar-input"
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <IconButton
        type="submit"
        disabled={!input}
        styles="disabled:hidden disabled:cursor-not-allowed active:flex"
        icon={<Airplane />}
      />
    </form>
  );
}

export default MessageInput;
