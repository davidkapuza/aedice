import Image from "next/image";
import { MessageType } from "../../../typings";
import TimeAgo from "react-timeago";

export default function Message({
  isOwner,
  message,
}: {
  message: MessageType;
  isOwner: boolean;
}) {
  return (
    <div className="message">
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
        <p className={`message-owner ${isOwner ? "text-right" : ""}`}>
          {message.username}
          <small className="timestamp">
            {" "}
            <TimeAgo
              className="text-sm text-gray-400"
              date={new Date(message.created_at)}
            />
          </small>
        </p>
        <p className={`message-text ${isOwner ? "text-right" : ""}`}>{message.message}</p>
      </div>
    </div>
  );
}
