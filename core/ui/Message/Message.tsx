import Image from "next/image";
import { memo } from "react";
import { Message } from "@/types/index";
import "./Message.styles.css";
import Avatar from "../Avatar/Avatar";

type Props = { message: Message; isOwner: boolean };

function Message({ isOwner, message }: Props) {
  return (
    <li className={`Message ${isOwner ? "Message-left" : "Message-right"}`}>
      <p className="text-black leading-[1.1rem]">{message.text}</p>
      {!isOwner && (
        <Avatar src={message.image} className="w-5 h-5"/>
      )}
    </li>
  );
}
export default memo(Message);
