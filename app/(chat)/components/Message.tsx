import Image from "next/image";
import { MessageType } from "../../../typings";
import TimeAgo from "react-timeago";
import { memo } from "react";

function Message({
  isOwner,
  message,
}: {
  message: MessageType;
  isOwner: boolean;
}) {
  return (
    <div className={`message ${isOwner ? "ml-auto" : "mr-auto"}`}>
      <div className={`avatar-wrapper ${isOwner ? "order-1" : ""}`}>
        <Image
          height={30}
          width={30}
          src={message.profilePic}
          alt="avatar"
          className="avatar"
        />
      </div>
      <div className="message-content">
        <small
          className={`message-owner ${isOwner ? "text-right" : "text-left"}`}
        >
          {!isOwner && message.username + " \u2022 "}

          <TimeAgo
            className="font-medium"
            date={new Date(message.created_at)}
          />

          {isOwner && " \u2022 " + message.username}
        </small>

        <p className={`${isOwner ? "message-text-right" : "message-text-left"} `}>
          {message.message}
        </p>
      </div>
    </div>
  );
}
export default memo(Message);
