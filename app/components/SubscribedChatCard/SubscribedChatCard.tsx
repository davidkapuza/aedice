import type { Chat, LastMessage, User } from "@/core/types";
import usePusherChannel from "@/lib/hooks/usePusherChannel";
import { getIdFromPathname } from "@/lib/utils/getIdFromPathname";
import AvatarsGroup from "app/components/AvatarsGroup/AvatarsGroup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import "./SubscribedChatCard.styles.css";

type Props = {
  chat: Chat;
};

function SubscribedChatCard({ chat }: Props) {
  const { last_message, last_message_time } = chat;
  const router = useRouter();
  const chat_id = getIdFromPathname();
  const isSelected = chat_id === chat.chat_id;
  const [members, setMembers] = useState<User[]>(chat.members);
  const [lastMessage, setLastMessage] = useState<LastMessage>({
    last_message,
    last_message_time,
  });

  const [events] = usePusherChannel(`private-chat-${chat.chat_id}`, [
    "member-joined",
    "member-left",
    "new-message",
  ]);

  useEffect(() => {
    if (events?.["member-joined"]) {
      setMembers(() => events["member-joined"] as User[]);
    }
    if (events?.["new-message"]) {
      setLastMessage(() => events["new-message"] as LastMessage);
    }
  }, [events]);

  return (
    <li>
      <button
        className={`Chat-card ${
          isSelected ? "border-white" : "border-gray-500"
        }`}
        onClick={() => router.push(`/chat/${chat.chat_id}`)}
      >
        {members ? (
          <>
            <AvatarsGroup
              avatars={members.map((member: any) => member.image)}
            />
            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="font-sans text-sm leading-3">{chat.name}</h1>
              <span className="inline-flex justify-between w-full">
                <small className="text-xs text-gray-500">
                  {lastMessage?.last_message}
                </small>
                {lastMessage?.last_message_time! > 0 && (
                  <ReactTimeago
                    className="text-xs text-gray-500"
                    date={new Date(+lastMessage?.last_message_time!)}
                    formatter={(value, unit) => {
                      if (unit === "second" && value < 15) return "now";
                      if (unit === "second") return `${value}s`;
                      if (unit === "minute") return `${value}m`;
                      if (unit === "hour") return `${value}h`;
                      if (unit === "day") return `${value}d`;
                      if (unit === "month") return `${value}mo`;
                      if (unit === "year") return `${value}y`;
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
export default SubscribedChatCard;
