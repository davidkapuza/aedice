import type { Chat } from "@/core/types";
import AvatarsGroup from "@/core/ui/AvatarsGroup/AvatarsGroup";
import { useChatInfoChannel } from "@/lib/hooks/useChatInfoChannel";
import { getChatFromPath } from "@/lib/utils/getChatFromPath";
import { useRouter } from "next/navigation";
import ReactTimeago from "react-timeago";
import "./SubscribedChatCard.styles.css"

type Props = {
  chat: Chat;
};

function SubscribedChatCard({ chat }: Props) {
  const router = useRouter();
  const path_id = getChatFromPath();
  const isSelected = path_id === chat.chat_id;
  const { membersFromChannel, lastMessageFromChannel } = useChatInfoChannel(
    chat.members,
    {
      last_message: chat.last_message,
      last_message_time: chat.last_message_time,
    },
    chat.chat_id
  );

  return (
    <li>
      <button
        className={`Chat-card ${
          isSelected ? "border-white" : "border-gray-500"
        }`}
        onClick={() => router.push(`/chat/${chat.chat_id}`)}
      >
        {membersFromChannel ? (
          <>
            <AvatarsGroup
              avatars={membersFromChannel.map((member: any) => member.image)}
            />

            <div className="flex-1 w-full mt-3 text-left">
              <h1 className="font-sans text-sm leading-3">{chat.name}</h1>
              <span className="inline-flex justify-between w-full">
                <small className="text-xs text-gray-500">
                  {lastMessageFromChannel?.last_message}
                </small>
                {lastMessageFromChannel?.last_message_time! > 0 && (
                  <ReactTimeago
                    className="text-xs text-gray-500"
                    date={new Date(+lastMessageFromChannel?.last_message_time!)}
                    formatter={(value, unit) => {
                      if (unit === "second" && value < 15) return "now";
                      if (unit === "second") return `${value}s ago`;
                      if (unit === "minute") return `${value}m ago`;
                      if (unit === "hour") return `${value}h ago`;
                      if (unit === "day") return `${value}d ago`;
                      if (unit === "month") return `${value}mo ago`;
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
export default SubscribedChatCard;
