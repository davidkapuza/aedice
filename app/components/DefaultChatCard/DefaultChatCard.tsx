"use client";
import Avatar from "@/core/ui/Avatar/Avatar";
import { Icons } from "@/core/ui/Icons/Icons";
import Loader from "@/core/ui/Loader/Loader";
import { joinChat } from "@/lib/services/client/chats";
import type { PublicChat, User } from "@/types/index";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import "./DefaultChatCard.styles.css";

type Props = {
  user: User;
  chat: PublicChat;
};

function DefaultChatCard({ user, chat }: Props) {
  const [isMember, setIsMember] = useState<boolean>(
    chat.member_ids.includes(user.id)
  );
  const { trigger, isMutating } = useSWRMutation("/api/chats", () =>
    joinChat(chat.chat_id, user)
  );
  // const isMember = chat.member_ids.includes(user.id);
  const router = useRouter();
  const join = async () => {
    trigger();
    router.push(`/chat/${chat.chat_id}`);
  };

  return (
    <div
      className="Default-Chat-Card"
      onClick={() => router.push(`/chat/${chat.chat_id}`)}
    >
      <Avatar src={chat.chat_image} className="w-6 h-6" />

      <div className="justify-start flex-1 w-full text-left">
        <h1 className="pt-[.125rem] font-sans text-sm">{chat.name}</h1>
        <button
          className="px-2 py-0.5 text-[10px] text-white bg-black border border-white rounded-full leading-3 disabled:cursor-not-allowed"
          disabled={isMember}
          onClick={join}
        >
          {isMutating ? (
            <Loader />
          ) : isMember ? (
            <Icons.checkCheck size={12} />
          ) : (
            "join"
          )}
        </button>
      </div>
    </div>
  );
}

export default DefaultChatCard;
