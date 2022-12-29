import { getChats } from "@/lib/services/server/chats";
import { getCurrentUser } from "@/lib/services/server/session";
import DropdownMenu from "app/components/DropdownMenu/DropdownMenu";
import "./Header.styles.css";
import Avatar from "@/core/ui/Avatar/Avatar";

export default async function Header() {
  const chats = await getChats();
  const user = await getCurrentUser();
  const user_chat_id = chats?.find(
    (chat) => chat.chat_owner_id === user?.id
  )?.chat_id;
  return (
    <header className="Header">
      <div className="inline-flex items-center flex-1 gap-4">
        <Avatar src={user?.image!} className="w-7 h-7"/>
        <span className="flex flex-col">
          <small className="text-gray-500 text-[10px]">Welcome back,</small>
          <h1 className="flex-1 font-sans font-medium">{user?.name}</h1>
        </span>
      </div>
      <h1 className="flex-1 font-sans text-2xl font-bold text-center">
        aedice.
      </h1>
      <DropdownMenu user_chat_id={user_chat_id} />
    </header>
  );
}
