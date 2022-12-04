import "./Message.styles.css"
import Image from "next/image";
import TimeAgo from "react-timeago";
import { memo } from "react";
import { TMessage } from "@core/types/entities";

function Message({
  isOwner,
  message,
}: {
  message: TMessage;
  isOwner: boolean;
}) {
  return (
    <div className={`Message ${isOwner ? "ml-auto" : "mr-auto"}`}>
        <Image
          height={30}
          width={30}
          src={message.image}
          alt="Avatar"
          className={`Avatar ${isOwner ? "order-1" : ""}`}
        />
      <div>
        <small
          className={`text-xs ${isOwner ? "text-right" : "text-left"}`}
        >
          {!isOwner && message.username + " \u2022 "}

          <TimeAgo
            className="font-medium"
            date={new Date(message.created_at)}
          />

          {isOwner && " \u2022 " + message.username}
        </small>

        <p className={`${isOwner ? "Message-text-right" : "Message-text-left"} `}>
          {message.message}
        </p>
      </div>
    </div>
  );
}
export default memo(Message);
