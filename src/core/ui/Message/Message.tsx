
import { TypeMessage } from "@/core/schemas/message";
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
    <li className={`Message ${isOwner ? "Message-left" : "Message-right"}`}>
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
    </li>
  );
}
export default memo(Message);
