import { Message } from "@/types/index";
import { memo } from "react";
import Avatar from "../Avatar/Avatar";
import "./Message.styles.css";

type Props = { message: Message; isOwner: boolean };

function Message({ isOwner, message }: Props) {
  return (
    <li className={`Message ${isOwner ? "Message-left" : "Message-right"}`}>
      <p className="text-black leading-[1.1rem] min-h-[26px] py-1">
        {message.text}
      </p>
      {!isOwner && <Avatar src={message.image} className="w-5 h-5" />}
    </li>
  );
}
export default memo(Message);
