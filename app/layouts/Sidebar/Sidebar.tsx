import type { User } from "@/core/types";
import { getCurrentUser } from "@/lib/services/server/session";
import ChatsList from "app/components/ChatsList/ChatsList";
import ChatsSearch from "app/components/ChatsSearch/ChatsSearch";
import "./Sidebar.styles.css";

export default async function Sidebar() {
  const user = (await getCurrentUser()) as User;
  if (!user) return <p className="text-white">No User</p>;

  return (
    <aside className="Sidebar">
      <ChatsSearch user={user} />
      <ChatsList user={user} />
    </aside>
  );
}
