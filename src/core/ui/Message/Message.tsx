import "./Message.styles.css";
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
    <div className={`Message ${isOwner ? "Message-left" : "Message-right"}`}>
      <p className="text-black leading-[1.1rem]">{message.message}</p>
      {!isOwner && (
        <Image
          src={message.image}
          width={20}
          height={20}
          alt="Avatar"
          className="Avatar"
        ></Image>
      )}
      {/* <div>
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

      </div> */}
    </div>
  );
}
export default memo(Message);
