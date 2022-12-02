"use client"
import "./SearchItem.styles.css";
import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

function SearchItem({ user }: any) {
  const { data: session } = useSession()

  const router = useRouter();

  const enterChat = async (chatId: string) => {
    await fetch("/api/chat/enterChat", {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: session?.user, chatId }),
    })
    router.push("chat/" + chatId)
  }

  return (
    <li >
      <button className="Search-item" onClick={() => enterChat(user.chatId)}>
        <Image
          className="mr-2 Avatar"
          width={40}
          height={40}
          src={user.image}
          alt="Avatar"
        ></Image>
        <div className="flex-1">
          <h1 className="text-sm leading-3">{user.name}</h1>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </button>
    </li>
  );
}

export default SearchItem;
