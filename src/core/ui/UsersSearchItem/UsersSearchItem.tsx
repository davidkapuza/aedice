"use client";
import { joinChat } from "@/lib/services/client/chats";
import { TypeUser } from "@/lib/validations/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./UsersSearchItem.styles.css";

type Props = {
  owner: TypeUser;
  user: TypeUser;
};

function SearchItem({ owner: { name, email, image, chat_id }, user }: Props) {
  const router = useRouter();
  const join = async (chat_id: string) => {
    router.push(`chat/${chat_id}`);
    await joinChat(chat_id, user);
  };

  return (
    <li>
      <div className="Search-item">
        <div className="flex justify-between w-full">
          <Image
            className="mr-2 Avatar"
            width={25}
            height={25}
            src={image}
            alt="Avatar"
          ></Image>
          <button
            onClick={() => join(chat_id)}
            className="px-2 text-xs rounded-full dark:bg-white dark:text-black"
          >
            Add
          </button>
        </div>
        <div className="flex-1 w-full mt-3 text-left">
          <h1 className="text-sm leading-3">{name}</h1>
          <small className="text-xs text-gray-500">{email}</small>
        </div>
      </div>
    </li>
  );
}

export default SearchItem;
