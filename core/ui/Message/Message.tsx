import Image from "next/image";
import { memo } from "react";
import { Message } from "@/types/index";
import "./Message.styles.css";

type Props = { message: Message; isOwner: boolean };

function Message({ isOwner, message }: Props) {
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
