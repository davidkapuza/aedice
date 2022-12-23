"use client";
import Image from "next/image";
import { joinChat } from "@/lib/services/client/chats";
import { useRouter } from "next/navigation";
import "./DefaultChatCard.styles.css";
import type { LastMessage, PublicChat, User } from "@/types/index";
import useSWRMutation from "swr/mutation";
import Loader from "@/core/ui/Loader/Loader";

type Props = {
  user: User;
  chat: PublicChat;
  isSelected?: boolean;
  isSubscribed?: boolean;
  membersFromChannel?: User[];
  lastMessageFromChannel?: LastMessage;
};

function DefaultChatCard({ user, chat }: Props) {
  const { trigger, isMutating } = useSWRMutation("/api/chats", () =>
    joinChat(chat.chat_id, user)
  );
  const router = useRouter();
  const join = async () => {
    trigger();
    router.push(`/chat/${chat.chat_id}`);
  };

  return (
    <li>
      <div
        className="Default-Chat-Card"
        onClick={() => router.push(`/chat/${chat.chat_id}`)}
      >
        <div className="inline-flex items-center justify-between w-full">
          <Image
            src={chat.chat_image}
            height={25}
            width={25}
            alt="Avatar"
            className="Avatar"
          ></Image>
          <button
            className="px-2 py-0.5 ml-3 text-[10px] h-fit text-black bg-white rounded-full"
            onClick={join}
          >
            {isMutating ? <Loader /> : "join"}
          </button>
        </div>
        <div className="flex-1 w-full mt-3 text-left">
          <h1 className="font-sans text-sm leading-3">{chat.name}</h1>
        </div>
      </div>
    </li>
  );
}

export default DefaultChatCard;
