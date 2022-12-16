import { clientPusher } from "@/core/pusher";
import { TypeMessage } from "@/core/schemas/message";
import { TypeUser } from "@/core/schemas/user";
import { TypeInitialMessage } from "@/core/types/entities";
import { useState, useEffect } from "react";

export function useChatInfoSub(
  initialMemmbers: TypeUser[],
  initialLastMessage: TypeInitialMessage,
  chat_id: string
) {
  const [chatMembers, setChatMembers] = useState<TypeUser[]>(initialMemmbers);
  const [chatLastMsessage, setChatLastMessage] = useState(initialLastMessage);

  useEffect(() => {
    const channel = clientPusher.subscribe(`cache-chat-update-${chat_id}`);
    channel.bind("new-member", async (member: TypeUser) => {
      if (chatMembers.some((m) => m.id === member.id)) return;
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
  }, [initialMemmbers, clientPusher]);
  return { chatMembers, chatLastMsessage };
}
