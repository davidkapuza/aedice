import { clientPusher } from "@/core/pusher";
import type { LastMessage, Message, User } from "@/core/types";
import { LastMessageSchema } from "@/core/validations";
import { useEffect, useState } from "react";

export function useChatInfoChannel(
  initialMemmbers: User[],
  initialLastMessage: LastMessage,
  chat_id: string
) {
  const [membersFromChannel, setMembersFromChannel] =
    useState<User[]>(initialMemmbers);
  const [lastMessageFromChannel, setLastMessageFromChannel] =
    useState<LastMessage>(initialLastMessage);

  useEffect(() => {
    const channel = clientPusher.subscribe(`private-chat-room-${chat_id}`);
    channel.bind("pusher:subscription_error", (error: Error) => {
      console.log(error.message);
    });
    channel.bind("new-message", async (message: Message) => {
      setLastMessageFromChannel(
        LastMessageSchema.parse({
          last_message: message.text,
          last_message_time: message.created_at,
        })
      );
    });
    channel.bind("member-joined", async (member: User) => {
      if (membersFromChannel.some((prev) => prev.id === member.id)) return;
      setMembersFromChannel((prev) => [...prev, member]);
    });
    channel.bind("member-left", async (members: User[]) => {
      setMembersFromChannel(members);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chat_id, initialLastMessage, initialMemmbers, clientPusher]);
  return { membersFromChannel, lastMessageFromChannel };
}
