import type { PrivateChat, Message, PublicChat, User } from "@/core/types";
import Glow from "@/core/ui/Glow/Glow";
import usePusher from "@/lib/hooks/pusher/usePusher";
import { getIdFromString } from "@/lib/utils/getIdFromString";
import AvatarsGroup from "app/components/AvatarsGroup/AvatarsGroup";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactTimeago from "react-timeago";

type Props = {
  chat: PrivateChat;
  user: User;
};

function PrivateChatCard({ chat, user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const chat_id = getIdFromString(pathname);
  const [isSeleted, toggleIsSelected] = useState(chat_id === chat.chat_id);
  const [members, setMembers] = useState<User[]>(chat.members);
  const [lastMessage, setLastMessage] = useState<Message>(chat.last_message);

  const [events] = usePusher({
    channel: `private-chat-room-${chat.chat_id}`,
    events: ["member-joined", "member-left", "new-message"],
  });

  useEffect(() => {
    if (events?.["member-joined"]) {
      const newMember = events["member-joined"] as User;
      if (newMember.id === user.id) return;
      setMembers((prev) => [...prev, newMember]);
    }
    if (events?.["member-left"]) {
      const oldMember = events["member-left"];
      if (oldMember.id === user.id) return;
      setMembers(
        (prev) => prev.filter((member) => member.id !== oldMember.id) as User[]
      );
    }
    if (events?.["new-message"]) {
      const message = events["new-message"] as Message;
      setLastMessage(message);
    }
  }, [events]);

  return (
    <li>
      <button
        className="w-full cursor-pointer"
        onClick={() => router.push(`/chat/${chat.chat_id}`)}
      >
        <Glow className="p-5 text-left ChatCard rounded-xl" border="rounded-xl">
          <AvatarsGroup avatars={members?.map((member: any) => member.image)} />
          <div className="mt-3 text-left">
            <h1 className="text-base leading-3">{chat.name}</h1>
            <span className="inline-flex items-center w-full">
              <Image
                src={lastMessage.image}
                height={12}
                width={12}
                className="Avatar"
                alt="Avatar"
              />
              <small className="ml-1.5 overflow-hidden text-sm text-gray-500 overflow-ellipsis whitespace-nowrap">
                {lastMessage?.text}
              </small>
              {lastMessage?.created_at && (
                <ReactTimeago
                  className="ml-auto text-sm text-gray-500"
                  date={new Date(+lastMessage?.created_at)}
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
        </Glow>
      </button>
    </li>
  );
}
export default PrivateChatCard;
