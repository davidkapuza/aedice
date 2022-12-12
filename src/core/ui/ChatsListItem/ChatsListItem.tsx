"use client";
import { clientPusher } from "@/core/pusher";
import { TypeUser } from "@/lib/validations/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import AvatarsGroup from "../AvatarsGroup/AvatarsGroup";
import "./ChatsListItem.styles.css";

type Props = {
  chat: any;
};

function ChatsListItem({
  chat: { members, id, last_message, last_message_time },
}: Props) {
  const router = useRouter();
  const [chatMembers, setChatMembers] = useState<TypeUser[]>(members!);
  const owner = members?.filter((member: any) => member.chat_id === id)[0];

  useEffect(() => {
    const channel = clientPusher.subscribe(`chat-members-${id}`);
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
      <button className="Chats-li" onClick={() => router.push(`chat/${id}`)}>
        {chatMembers ? (
          <>
            <AvatarsGroup
              avatars={chatMembers.map((member: any) => member.image)}
            />
            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="text-sm leading-3">{owner?.name}</h1>
              <span className="inline-flex justify-between w-full">
                <small className="text-xs text-gray-500">{last_message}</small>
                {last_message_time && (
                  <ReactTimeago
                    className="text-xs text-gray-500"
                    date={new Date(+last_message_time)}
                    formatter={(value, unit) => {
                      if (unit === 'second' && value < 15) return "now";
                      if (unit === "second") return `${value}s ago`;
                      if (unit  === "minute") return `${value}m ago`;
                      if (unit  === "hour") return `${value}h ago`;
                      if (unit  === "day") return `${value}d ago`;
                      if (unit  === "month") return `${value}m ago`;
                      if (unit  === "year") return `${value}y ago`;
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
