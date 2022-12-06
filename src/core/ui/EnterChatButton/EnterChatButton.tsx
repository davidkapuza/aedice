"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./EnterChatButton.styles.css";

function EnterChatButton({ user, chat_id }: any) {
  const router = useRouter();
  return (
    <li>
      <button
        className="Enter-chat-button"
        onClick={() => router.push(`chat/${chat_id}`)}
      >
        <Image
          src={user.image}
          width={30}
          height={30}
          alt="Avatar"
          className="mr-2 Avatar"
        />
        <div className="flex-1">
          <h1 className="text-sm leading-3">{user.name}</h1>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </button>
    </li>
  );
}

export default EnterChatButton;
