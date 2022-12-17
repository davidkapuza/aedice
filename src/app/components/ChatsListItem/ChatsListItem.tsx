"use client";
import AvatarsGroup from "@/core/ui/AvatarsGroup/AvatarsGroup";
import { useChatInfoChannel } from "@/lib/hooks/useChatInfoChannel";
import { getChatFromPath } from "@/lib/utils/getChatFromPath";
import { usePathname, useRouter } from "next/navigation";
import ReactTimeago from "react-timeago";

import "./ChatsListItem.styles.css";

type Props = {
  chat: any;
};

function ChatsListItem({
  chat: { members, id, last_message, last_message_time, chat_owner },
}: Props) {
  const router = useRouter();
  const chat_id = getChatFromPath()
  const chatOwner = members?.filter(
    (member: any) => member.id === chat_owner
  )[0];

  const { chatMembers, chatLastMsessage } = useChatInfoChannel(
    members,
    { last_message, last_message_time },
    id
  );

  return (
    <li>
      <button
        className={`Chats-li ${
          chat_id === id ? "border-white" : "border-gray-500"
        }`}
        onClick={() => router.push(`chat/${id}`)}
      >
        {chatMembers ? (
          <>
            <AvatarsGroup
              avatars={chatMembers.map((member: any) => member.image)}
            />
            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="font-sans text-sm leading-3">{chatOwner?.name}</h1>
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
