import ChatsList from "app/components/ChatsList/ChatsList";
import UsersSearch from "app/components/Search/Search";
import { getChats } from "@/lib/services/server/chats";
import { getCurrentUser } from "@/lib/services/server/session";

import "./Sidebar.styles.css";

export default async function Sidebar() {
  const user = await getCurrentUser();
  const prerenderedChats = await getChats();
  if (!user) return <p className="text-white">No User</p>;
  // ! Bug with getting session on prerender
  return (
    <aside className="Sidebar">
      <UsersSearch user={user} />
      <ChatsList prerenderedChats={prerenderedChats} user={user} />
    </aside>
  );
}