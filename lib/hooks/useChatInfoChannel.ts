import { clientPusher } from "@/core/pusher";
import { TypeMessage, TypeLastMessage } from "@/core/types/entities";
import { User } from "next-auth";
import { useState, useEffect } from "react";

export function useChatInfoChannel(
  initialMemmbers: User[],
  initialLastMessage: TypeLastMessage,
  chat_id: string
) {
  const [membersFromChannel, setMembersFromChannel] =
    useState<User[]>(initialMemmbers);
  const [lastMessageFromChannel, setLastMessageFromChannel] =
    useState<TypeLastMessage>(initialLastMessage);

  useEffect(() => {
    console.log(chat_id);
    const channel = clientPusher.subscribe(`chat-room-${chat_id}`);
    channel
      .bind("pusher:subscription_error", (error: any) => {
        const { status } = error;
        console.log(status);
      })
      .bind("new-message", async (message: TypeMessage) => {
        console.log("NEW MESSAGE EVENT >> ", message);
        setLastMessageFromChannel({
          last_message: message.text,
          last_message_time: message.created_at,
        });
      })
      .bind("member-joined", async (member: User) => {
        if (membersFromChannel.some((prev) => prev.id === member.id)) return;
        setMembersFromChannel((prev) => [...prev, member]);
      })
      .bind("member-left", async (members: User[]) => {
        setMembersFromChannel(members);
      });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chat_id, initialLastMessage, initialMemmbers, clientPusher]);
  return { membersFromChannel, lastMessageFromChannel };
}
