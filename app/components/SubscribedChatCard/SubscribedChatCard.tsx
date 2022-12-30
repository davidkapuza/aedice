import type { Chat, LastMessage, Message, User } from "@/core/types";
import usePusherChannel from "@/lib/hooks/usePusherEvents";
import { getIdFromPathname } from "@/lib/utils/getIdFromPathname";
import AvatarsGroup from "app/components/AvatarsGroup/AvatarsGroup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactTimeago from "react-timeago";
import "./SubscribedChatCard.styles.css";

type Props = {
  chat: Chat;
  user: User;
};

function SubscribedChatCard({ chat, user }: Props) {
  const { last_message, last_message_time } = chat;
  const router = useRouter();
  const chat_id = getIdFromPathname();
  const isSelected = chat_id === chat.chat_id;
  const [members, setMembers] = useState<User[]>(chat.members);
  const [lastMessage, setLastMessage] = useState<LastMessage>({
    last_message,
    last_message_time,
  });

  const [events, setEvent] = usePusherChannel(`private-chat-${chat.chat_id}`, [
    "member-joined",
    "member-left",
    "new-message",
  ]);

  useEffect(() => {
    if (events?.["member-joined"]) {
      const newMember = events["member-joined"] as User;
      console.log(
        "USER LEFT >>> ",
        events["member-joined"],
        events["member-joined"].id === user.id
      );
      setMembers((prev) => [...prev, newMember]);
    }
    if (events?.["member-left"]) {
      console.log(
        "USER LEFT >>> ",
        events["member-left"],
        events["member-left"].id === user.id
      );
      if (events["member-left"].id === user.id) return;
      setMembers(
        (prev) =>
          prev.filter(
            (member) => member.id !== events["member-left"].id
          ) as User[]
      );
    }
    if (events?.["new-message"]) {
      const message = events["new-message"] as Message;
      setLastMessage({
        last_message: message.text,
        last_message_time: message.created_at,
      });
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
              avatars={members?.map((member: any) => member.image)}
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
