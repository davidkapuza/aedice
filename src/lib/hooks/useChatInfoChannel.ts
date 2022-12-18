import { clientPusher } from "@/core/pusher";
import { TypeMessage, TypeLastMessage } from "@/core/types/entities";
import { User } from "next-auth";
import { useState, useEffect } from "react";

export function useChatInfoChannel(
  initialMemmbers: User[],
  initialLastMessage: TypeLastMessage,
  chat_id: string
) {
  const [membersFromChannel, setMembersFromChannel] = useState<User[]>(initialMemmbers);
  const [lastMessageFromChannel, setLastMessageFromChannel] = useState(initialLastMessage);

  useEffect(() => {
    const channel = clientPusher.subscribe(`cache-chat-update-${chat_id}`);
    channel.bind("member-joined", async (member: User) => {
      if (membersFromChannel.some((prev) => prev.id === member.id)) return;
      setMembersFromChannel((prev) => [...prev, member]);
    });
    channel.bind("member-quit", async (members: User[]) => {
      setMembersFromChannel(members);
    });
    channel.bind("new-message", async (message: TypeMessage) => {
      setLastMessageFromChannel({
        last_message: message.text,
        last_message_time: message.created_at,
      });
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [initialMemmbers, clientPusher]);
  return { membersFromChannel, lastMessageFromChannel };
}
