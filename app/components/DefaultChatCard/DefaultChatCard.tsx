"use client";
import Avatar from "@/core/ui/Avatar/Avatar";
import { Icons } from "@/core/ui/Icons/Icons";
import Loader from "@/core/ui/Loader/Loader";
import usePusher from "@/lib/hooks/pusher/usePusher";
import type { PublicChat, User } from "@/types/index";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import "./DefaultChatCard.styles.css";

type Props = {
  user: User;
  chat: PublicChat;
};

export async function joinChat(chat_id: string, user: User) {
  await fetch(`/api/chats/${chat_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user }),
  });
}

function DefaultChatCard({ user, chat }: Props) {
  const [events] = usePusher({ channel: `private-user-chats-${user.id}` });
  const [isMember, setIsMember] = useState<boolean>(
    chat.member_ids.includes(user.id)
  );
  const { trigger, isMutating } = useSWRMutation("/api/chats", () =>
    joinChat(chat.chat_id, user)
  );
  const router = useRouter();
  const join = async () => {
    setIsMember(true);
    trigger();
    router.push(`/chat/${chat.chat_id}`);
  };
  useEffect(() => {
    if (events?.["chat-removed"]) {
      events["chat-removed"].chat_id === chat.chat_id && setIsMember(false);
    }
  }, [events]);

  return (
    <div
      className="Default-Chat-Card"
      onClick={() => router.push(`/chat/${chat.chat_id}`)}
    >
      <Avatar src={chat.chat_image} className="w-6 h-6" />

      <div className="justify-start flex-1 w-full text-left">
        <h1 className="pt-[.125rem] text-base">{chat.name}</h1>
        <button
          className="flex min-h-[19px] items-center flex-row gap-2 px-2 py-0.5 text-[10px] text-white bg-black border border-white rounded-full leading-3 disabled:cursor-not-allowed"
          disabled={isMember}
          onClick={join}
        >
          {isMutating ? (
            <Loader className="w-2.5 h-2.5" />
          ) : isMember ? (
            <>
              {"member"}
              <Icons.checkCheck size={12} />
            </>
          ) : (
            "join"
          )}
        </button>
      </div>
    </div>
  );
}

export default DefaultChatCard;
