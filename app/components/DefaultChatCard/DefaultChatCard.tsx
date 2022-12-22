"use client";
import type { ChatEntity, TypeLastMessage } from "@/core/types/entities";
import Image from "next/image";
import { joinChat } from "@/lib/services/client/chats";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import "./DefaultChatCard.styles.css";

type Props = {
  user: User;
  chat: ChatEntity;
  isSelected?: boolean;
  isSubscribed?: boolean;
  membersFromChannel?: User[];
  lastMessageFromChannel?: TypeLastMessage;
};

function DefaultChatCard({ user, chat }: Props) {
  const router = useRouter();
  const chatOwner = chat.members?.filter(
    (member: User) => member.id === chat.chat_owner
  )[0];
  const join = async (chat_id: string) => {
    router.push(`/chat/${chat_id}`);
    await joinChat(chat_id, user);
  };

  return (
    <li>
      <div
        className="Default-Chat-Card"
        onClick={() => router.push(`/chat/${chat.chat_id}`)}
      >
        {chat.members ? (
          <>
            <div className="inline-flex items-center justify-between w-full">
              <Image
                src={chatOwner.image}
                height={25}
                width={25}
                alt="Avatar"
                className="Avatar"
              ></Image>
              <button
                className="px-2 py-0.5 ml-3 text-[10px] h-fit text-black bg-white rounded-full"
                onClick={() => join(chat.chat_id)}
              >
                Join
              </button>
            </div>

            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="font-sans text-sm leading-3">{chatOwner?.name}</h1>
              <small className="text-xs text-gray-500">
                {chatOwner?.email}
              </small>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </li>
  );
}

export default DefaultChatCard;
