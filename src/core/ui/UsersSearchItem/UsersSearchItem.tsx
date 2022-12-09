"use client";
import "./UsersSearchItem.styles.css";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function SearchItem({ user }: any) {
  const router = useRouter();
  // TODO create chat roles to be able to have more then two members
  const enterChat = async (user: any) => {
    await fetch("/api/chats/enterChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatOwner: user }),
    });
    router.push("chat/" + user.chat_id);
  };

  return (
    <li>
      <div className="Search-item">
        <div className="flex justify-between w-full">
          <Image
            className="mr-2 Avatar"
            width={25}
            height={25}
            src={user.image}
            alt="Avatar"
          ></Image>
          <button
            onClick={() => enterChat(user)}
            className="px-2 text-xs rounded-full dark:bg-white dark:text-black"
          >
            Add
          </button>
        </div>
        <div className="flex-1 w-full mt-3 text-left">
          <h1 className="text-sm leading-3">{user.name}</h1>
          <small className="text-xs text-gray-500">{user.email}</small>
        </div>
      </div>
    </li>
  );
}

export default SearchItem;
