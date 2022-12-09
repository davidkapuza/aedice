"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AvatarsGroup from "../AvatarsGroup/AvatarsGroup";
import "./ChatsListItem.styles.css";

function ChatsListItem({ members, chatOwner, chat_id }: any) {
  const router = useRouter();

  return (
    <li>
      <button
        className="Chats-li"
        onClick={() => router.push(`chat/${chat_id}`)}
      >
        <AvatarsGroup avatars={members.map((member: any) => member.image)} />
        <div className="flex-1 w-full mt-3 text-left">
          <h1 className="text-sm leading-3">{chatOwner.name}</h1>
          <span className="inline-flex justify-between w-full">
            <small className="text-xs text-gray-500">Last message...</small>
            <span className="text-sm text-gray-500">12m</span>
          </span>
        </div>
      </button>
    </li>
  );
}

export default ChatsListItem;
