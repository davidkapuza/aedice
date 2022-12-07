"use client";
import "./UsersSearchItem.styles.css";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import IconButton from "../IconButton/IconButton";
import AddIcon from "@core/icons/AddIcon";

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
        <Image
          className="mr-2 Avatar"
          width={25}
          height={25}
          src={user.image}
          alt="Avatar"
        ></Image>
        <div className="flex-1">
          <h1 className="text-sm leading-3">{user.name}</h1>
          <span className="py-[0.1rem] px-1 text-[10px] text-black bg-white rounded-full">
            {user.email}
          </span>
        </div>
        <button className="w-5 h-5">
          <AddIcon />
        </button>
      </div>
    </li>
  );
}

export default SearchItem;
