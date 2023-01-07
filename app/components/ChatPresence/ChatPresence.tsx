"use client";
import usePusherEvents from "@/lib/hooks/pusher/usePusherEvents";
import { getIdFromPathname } from "@/lib/utils/getIdFromPathname";
import { useEffect, useState } from "react";

function ChatPresence() {
  const chat_id = getIdFromPathname();
  const [presence, setPresence] = useState<number>(0);
  const [events] = usePusherEvents(
    chat_id ? `presence-chat-room-messages-${chat_id}` : null,
    [
      "pusher:subscription_succeeded",
      "pusher:member_added",
      "pusher:member_removed",
    ]
  );

  useEffect(() => {
    if (chat_id) {
      setPresence(
        events?.["pusher:subscription_succeeded"]?.count ||
          events?.["pusher:member_added"]?.count ||
          events?.["pusher:member_removed"]?.count
      );
    }
  }, [events]);

  return (
    <>
      {presence > 0 && (
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
