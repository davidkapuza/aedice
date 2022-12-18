"use client";
import { TypeMessage } from "@/core/types/entities";
import Message from "@/core/ui/Message/Message";
import { useMessagesChannel } from "@/lib/hooks/useMessagesChannel";
import { User } from "next-auth";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User | undefined;
  prerenderedMessages?: TypeMessage[];
  chat_id: string;
};

function Chat({ prerenderedMessages, chat_id, user }: Props) {
  const { messages } = useMessagesChannel(chat_id);
  return (
    <div>
      <ul className="Chat">
        {(messages || prerenderedMessages)?.map((message: TypeMessage) => {
          const isOwner = user?.email === message.email;
          return (
            <Message key={message.id} message={message} isOwner={isOwner} />
          );
        })}
      </ul>
      <ChatInput user={user} chat_id={chat_id} />
    </div>
  );
}

export default Chat;
