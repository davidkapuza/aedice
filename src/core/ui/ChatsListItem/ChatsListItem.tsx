"use client";
import { clientPusher } from "@/core/pusher";
import { TypeUser } from "@/lib/validations/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AvatarsGroup from "../AvatarsGroup/AvatarsGroup";
import "./ChatsListItem.styles.css";

type Props = {
  members?: TypeUser[];
  chat_id: string;
};

function ChatsListItem({ members, chat_id }: Props) {
  const router = useRouter();

  const [chatMembers, setChatMembers] = useState<TypeUser[]>(members!);
  const owner = members?.filter((member: any) => member.chat_id === chat_id)[0];

  useEffect(() => {
    const channel = clientPusher.subscribe(`chat-members-${chat_id}`);
    channel.bind("new-member", async (member: TypeUser) => {
      setChatMembers((prev) => [...prev, member]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [members, clientPusher]);

  return (
    <li>
      <button
        className="Chats-li"
        onClick={() => router.push(`chat/${chat_id}`)}
      >
        {chatMembers ? (
          <>
            <AvatarsGroup
              avatars={chatMembers.map((member: any) => member.image)}
            />
            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="text-sm leading-3">{owner?.name}</h1>
              <span className="inline-flex justify-between w-full">
                <small className="text-xs text-gray-500">Last message...</small>
                <span className="text-sm text-gray-500">12m</span>
              </span>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </button>
    </li>
  );
}

export default ChatsListItem;
