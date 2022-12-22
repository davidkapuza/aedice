"use client";
import { clientPusher } from "@/core/pusher";
import { getChatFromPath } from "@/lib/utils/getChatFromPath";
import { PresenceChannel } from "pusher-js";
import React, { useEffect, useState } from "react";

function ChatPresence() {
  const chat_id = getChatFromPath();
  const [presence, setPresence] = useState(0);

  useEffect(() => {
    const channel = clientPusher.subscribe(
      `presence-chat-room-messages-${chat_id}`
    );
    channel.bind("pusher:subscription_succeeded", () => {
      setPresence((channel as PresenceChannel).members.count);
    });
    channel.bind("pusher:member_removed", () => {
      setPresence((prev) => prev - 1);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chat_id, clientPusher]);

  return (
    <>
      {(chat_id !== "chat" && presence > 0) && (
        <div className="flex items-center justify-center flex-1 gap-2">
          <svg
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
            className="w-1.5 h-1.5"
            height={5}
            width={5}
          >
            <circle cx="5" cy="5" r="5" fill="#90EE90" />
          </svg>
          <p className="text-xs">{presence} here</p>
        </div>
      )}
    </>
  );
}

export default ChatPresence;
