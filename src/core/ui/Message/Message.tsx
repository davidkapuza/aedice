import { TypeMessage } from "@/lib/validations/message";
import Image from "next/image";
import { memo } from "react";
import "./Message.styles.css";

function Message({
  isOwner,
  message,
}: {
  message: TypeMessage;
  isOwner: boolean;
}) {
  return (
    <div className={`Message ${isOwner ? "Message-left" : "Message-right"}`}>
      <p className="text-black leading-[1.1rem]">{message.text}</p>
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