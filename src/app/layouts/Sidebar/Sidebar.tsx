import ChatsList from "@/core/ui/ChatsList/ChatsList";
import UsersSearch from "@/core/ui/UsersSearch/UsersSearch";
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