import { getCurrentUser } from "@/lib/services/server/session";
import ChatsList from "app/components/ChatsList/ChatsList";
import UsersSearch from "app/components/Search/Search";
import "./Sidebar.styles.css";

export default async function Sidebar() {
  const user = await getCurrentUser();
  if (!user) return <p className="text-white">No User</p>;
  // ! Bug with getting session on prerender
  return (
    <aside className="Sidebar">
      <UsersSearch user={user} />
      <ChatsList user={user} />
    </aside>
  );
}
