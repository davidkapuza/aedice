"use client";
import type { Message as TypeMessage, User } from "@/core/types";
import Message from "@/core/ui/Message/Message";
import usePusherEvents from "@/lib/hooks/pusher/usePusherEvents";
import useMessages from "@/lib/hooks/swr/useMessages";
import Pusher from "pusher-js";
import { useEffect, useRef } from "react";
import ChatInput from "../ChatInput/ChatInput";
import "./Chat.styles.css";

type Props = {
  user: User;
  chat_id: string;
};
const pusher =  new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: "eu",
  activityTimeout: 60,
  forceTLS: true,
  userAuthentication: {
    endpoint: "/api/pusher/user-auth",
    transport: "ajax",
  },
  channelAuthorization: { endpoint: "/api/pusher/auth", transport: "ajax" },
})
function Chat({ chat_id, user }: Props) {
  const bottomRef = useRef<HTMLSpanElement>(null);
  const { messages, mutate } = useMessages(chat_id);
  // const [events] = usePusherEvents(`private-chat-room-messages-${chat_id}`, [
  //   "new-message",
  // ]);
  // useEffect(() => {
  //   if (events?.["new-message"]) {
  //     const newMessage = events["new-message"] as TypeMessage;
  //     if (messages?.find((msg) => msg.id === newMessage.id)) return;
  //     if (!messages) {
  //       mutate();
  //     } else {
  //       mutate({
  //         messages: [...messages!, newMessage],
  //       });
  //     }
  //   }
  // }, [events]);

  

    useEffect(() => {
      let channel = pusher.subscribe(`private-chat-room-messages-${chat_id}`)
      channel.bind("new-message", (message: any) => {
        if (messages?.find((msg) => msg.id === message.id)) return;
      if (!messages) {
        mutate();
      } else {
        mutate({
          messages: [...messages!, message],
        });
      }
      })
      return () => {
        channel.unsubscribe()
      }
    }, [pusher])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="ChatLayout">
      <ul className="Chat">
        {messages?.map((message) => {
          const isOwner = user?.id === message.sender_id;
          return (
            <Message key={message.id} message={message} isOwner={isOwner} />
          );
        })}
      </ul>
      <span ref={bottomRef}></span>
      <ChatInput user={user} chat_id={chat_id} />
    </main>
  );
}

export default Chat;
