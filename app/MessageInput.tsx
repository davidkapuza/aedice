"use client";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { Message } from "../typings";

function MessageInput() {
  const [input, setInput] = useState("");
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    const msgToSend = input;

    setInput("");
    const id = uuid();
    const message: Message = {
      id,
      message: msgToSend,
      created_at: Date.now(),
      username: "Jhon Doe",
      profilePic: "https://avatars.dicebear.com/api/avataaars/JhonDoe.svg",
      email: "doe@domain.com",
    };

    const uploadMsgToUpstash = async () => {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      console.log("MESSAGE ADDED >>> ", data);
    };
    uploadMsgToUpstash()
  };
  return (
    <form onSubmit={(e) => sendMessage(e)} className="flex px-10 fixed bottom-10">
      <input
        value={input}
        placeholder="Enter message..."
        type="text"
        className="rounded border-gray-300"
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <button
        type="submit"
        disabled={!input}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
