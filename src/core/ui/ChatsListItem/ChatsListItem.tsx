"use client";
import { clientPusher } from "@/core/pusher";
import { TypeChat } from "@/core/schemas/chat";
import { TypeMessage } from "@/core/schemas/message";
import { TypeUser } from "@/core/schemas/user";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import AvatarsGroup from "../AvatarsGroup/AvatarsGroup";
import "./ChatsListItem.styles.css";

type Props = {
  chat: any;
};

function ChatsListItem({
  chat: { members, id, last_message, last_message_time, chat_owner },
}: Props) {
  const router = useRouter();
  const [chatMembers, setChatMembers] = useState<TypeUser[]>(members!);
  const [chatLastMsessage, setChatLastMessage] = useState({
    last_message,
    last_message_time,
  });

  const chatOwner = members?.filter(
    (member: any) => member.id === chat_owner
  )[0];
  useEffect(() => {
    const channel = clientPusher.subscribe(`cache-chat-update-${id}`);
    channel.bind("new-member", async (member: TypeUser) => {
      if (chatMembers.some((m) => m.id === member.id)) return
      setChatMembers((prev) => [...prev, member]);
    });
    channel.bind("new-message", async (message: TypeMessage) => {
      setChatLastMessage({
        last_message: message.text,
        last_message_time: message.created_at,
      });
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [members, clientPusher]);

  return (
    <li>
      <button className="Chats-li" onClick={() => router.push(`chat/${id}`)}>
        {chatMembers ? (
          <>
            <AvatarsGroup
              avatars={chatMembers.map((member: any) => member.image)}
            />
            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="text-sm leading-3">{chatOwner?.name}</h1>
              <span className="inline-flex justify-between w-full">
                <small className="text-xs text-gray-500">
                  {chatLastMsessage.last_message}
                </small>
                {chatLastMsessage.last_message_time && (
                  <ReactTimeago
                    className="text-xs text-gray-500"
                    date={new Date(+chatLastMsessage.last_message_time)}
                    formatter={(value, unit) => {
                      if (unit === "second" && value < 15) return "now";
                      if (unit === "second") return `${value}s ago`;
                      if (unit === "minute") return `${value}m ago`;
                      if (unit === "hour") return `${value}h ago`;
                      if (unit === "day") return `${value}d ago`;
                      if (unit === "month") return `${value}m ago`;
                      if (unit === "year") return `${value}y ago`;
                    }}
                  />
                )}
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
