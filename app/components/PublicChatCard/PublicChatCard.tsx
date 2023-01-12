"use client";
import Avatar from "@/core/ui/Avatar/Avatar";
import Glow from "@/core/ui/Glow/Glow";
import { Icons } from "@/core/ui/Icons/Icons";
import Loader from "@/core/ui/Loader/Loader";
import usePusher from "@/lib/hooks/pusher/usePusher";
import type { PublicChat, User } from "@/types/index";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";

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

function PublicChatCard({ user, chat }: Props) {
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
    <Glow className="p-5 ChatCard " border="rounded-xl">
      <div className="flex justify-between">
        <Avatar src={chat.chat_image} className="w-6 h-6" />
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
      <div className="mt-3 text-left">
        <h1 className="text-base leading-3">{chat.name}</h1>
        <small className="text-sm text-gray-500 leading-[6px]">{`${
          chat.member_ids.length
        } member${chat.member_ids.length > 1 ? "s" : ""} • ${
          chat.access
        }`}</small>
      </div>
    </Glow>
  );
}

export default PublicChatCard;
